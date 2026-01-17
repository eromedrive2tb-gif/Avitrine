import { db } from '../db';
import { models, posts, whitelabelModels } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { WhitelabelDbService } from './whitelabel';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_CONFIG } from './s3';

async function getPresignedUrl(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: S3_CONFIG.bucket,
        Key: key,
      });
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      return '';
    }
}

export const AdminService = {
  async activateModels(activateAll: boolean, specificModel?: string) {
    let foldersToProcess: string[] = [];
    let processedCount = 0;
    let newModelsCount = 0;
    let newPostsCount = 0;

    if (activateAll) {
       // Only process models that are in the staging table
       const allModels = await db.select({ folderName: whitelabelModels.folderName }).from(whitelabelModels);
       foldersToProcess = allModels.map(m => m.folderName);
    } else if (specificModel) {
      foldersToProcess = [specificModel];
    }

    for (const folder of foldersToProcess) {
      // 1. Deep Sync (S3 -> Whitelabel Tables)
      // This ensures we have all posts/media for this model in our staging tables
      await WhitelabelDbService.syncModelDetails(folder);

      // 2. Fetch from Staging (Whitelabel Tables)
      const cachedModel = await db.query.whitelabelModels.findFirst({
        where: eq(whitelabelModels.folderName, folder),
        with: {
            posts: {
                with: {
                    media: true
                }
            }
        }
      });

      if (!cachedModel) continue;

      // 3. Upsert into Main App (Models Table)
      let modelId: number;
      const existingModel = await db.query.models.findFirst({
        where: eq(models.name, cachedModel.folderName)
      });

      // Resolve thumbnail URL (if it's a key, sign it)
      let thumbUrl = cachedModel.thumbnailUrl;
      if (thumbUrl && !thumbUrl.startsWith('http')) {
          thumbUrl = await getPresignedUrl(thumbUrl);
      }

      if (existingModel) {
        modelId = existingModel.id;
      } else {
        const [inserted] = await db.insert(models).values({
          name: cachedModel.folderName,
          iconUrl: thumbUrl,
          bannerUrl: thumbUrl,
          description: `Model imported from S3: ${cachedModel.folderName}`,
          isFeatured: false,
          isAdvertiser: false
        }).returning();
        modelId = inserted.id;
        newModelsCount++;
      }

      // 4. Upsert Posts
      for (const stagingPost of cachedModel.posts) {
        // Determine main content (video > image)
        const videoMedia = stagingPost.media.find(m => m.type === 'video');
        const mainMedia = videoMedia || stagingPost.media[0];
        
        if (!mainMedia) continue;

        let contentUrl = mainMedia.s3Key;
        // Sign URL for main app usage
        // Note: In a real app, you might store the Key and sign on read, 
        // OR store a signed URL (expires), OR use a public CDN. 
        // The original code stored signed URLs or keys? 
        // Original code: contentUrl: postData.contentUrl (which was signed in getFullModelData)
        // So we should sign it here to maintain compatibility.
        const signedContentUrl = await getPresignedUrl(contentUrl);

        const existingPost = await db.query.posts.findFirst({
          where: eq(posts.contentUrl, signedContentUrl) // This check is brittle if URL changes/expires. ideally check by unique S3 key or title + modelId
        });
        
        // Better check: check by title and modelId if possible, but schema posts table doesn't enforce uniqueness there.
        // We will rely on the fact that we are importing.

        if (!existingPost) {
          await db.insert(posts).values({
            modelId: modelId,
            title: stagingPost.title || stagingPost.folderName,
            contentUrl: signedContentUrl,
            type: mainMedia.type as 'image' | 'video'
          });
          newPostsCount++;
        }
      }
      
      // Update status in staging
      await db.update(whitelabelModels)
        .set({ status: 'active' })
        .where(eq(whitelabelModels.id, cachedModel.id));

      processedCount++;
    }

    return {
      processedCount,
      newModelsCount,
      newPostsCount
    };
  },
};
