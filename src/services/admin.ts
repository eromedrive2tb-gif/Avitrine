import { db } from '../db';
import { models, posts } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { WhitelabelService } from './s3';

export const AdminService = {
  async activateModels(activateAll: boolean, specificModel?: string) {
    let foldersToProcess: string[] = [];
    let processedCount = 0;
    let newModelsCount = 0;
    let newPostsCount = 0;

    if (activateAll) {
      foldersToProcess = await WhitelabelService.listAllModelFolders();
    } else if (specificModel) {
      foldersToProcess = [specificModel];
    }

    for (const folder of foldersToProcess) {
      // Fetch full data from S3
      const s3Data = await WhitelabelService.getFullModelData(folder);

      // 1. Find or Create Model
      let modelId: number;
      const existingModel = await db.query.models.findFirst({
        where: eq(models.name, s3Data.folderName)
      });

      if (existingModel) {
        modelId = existingModel.id;
      } else {
        const [inserted] = await db.insert(models).values({
          name: s3Data.folderName,
          iconUrl: s3Data.thumbnailUrl,
          bannerUrl: s3Data.thumbnailUrl,
          description: `Model imported from S3: ${s3Data.folderName}`,
          isFeatured: false,
          isAdvertiser: false
        }).returning();
        modelId = inserted.id;
        newModelsCount++;
      }

      // 2. Sync Posts
      for (const postData of s3Data.posts) {
        const existingPost = await db.query.posts.findFirst({
          where: eq(posts.contentUrl, postData.contentUrl)
        });

        if (!existingPost) {
          await db.insert(posts).values({
            modelId: modelId,
            title: postData.id,
            contentUrl: postData.contentUrl,
            type: postData.type as 'image' | 'video'
          });
          newPostsCount++;
        }
      }
      processedCount++;
    }

    return {
      processedCount,
      newModelsCount,
      newPostsCount
    };
  },

  async getGlobalStats() {
    const dbPostsPromise = db.select({ count: sql<number>`count(*)` }).from(posts);
    const [dbStats] = await Promise.all([dbPostsPromise]);

    return {
      totalModels: "S3 Conectado",
      totalPosts: dbStats[0]?.count || 0,
      isEstimated: true
    };
  }
};
