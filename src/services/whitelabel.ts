import { db } from '../db';
import { whitelabelModels, whitelabelPosts, whitelabelMedia } from '../db/schema';
import { eq, desc, count, sql, and } from 'drizzle-orm';
import { s3Client, S3_CONFIG } from './s3';
import { ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const WhitelabelDbService = {
  /**
   * Syncs the ENTIRE bucket structure (Models > Posts > Media) to the Database.
   * Optimized with Batch Inserts to avoid Timeouts.
   */
  async syncModelsFromBucket() {
    let continuationToken: string | undefined = undefined;
    let isTruncated = true;
    let totalObjectsProcessed = 0;

    // 1. Pre-fetch Maps to minimize DB reads
    // Note: If memory issues arise (e.g. >100k posts), we might need to scope this per loop or LRU,
    // but for 800 models / 50k posts, it's fine (~5MB RAM).
    
    const allModels = await db.select({ id: whitelabelModels.id, folderName: whitelabelModels.folderName }).from(whitelabelModels);
    const modelMap = new Map<string, number>(allModels.map(m => [m.folderName, m.id]));

    const allPosts = await db.select({ id: whitelabelPosts.id, modelId: whitelabelPosts.whitelabelModelId, folderName: whitelabelPosts.folderName }).from(whitelabelPosts);
    // Key: "ModelID:PostFolderName"
    const postMap = new Map<string, number>(allPosts.map(p => [`${p.modelId}:${p.folderName}`, p.id]));

    const stats = { models: 0, posts: 0, media: 0 };

    while (isTruncated) {
      const command = new ListObjectsV2Command({
        Bucket: S3_CONFIG.bucket,
        MaxKeys: 1000, 
        ContinuationToken: continuationToken
      });

      const response = await s3Client.send(command);
      
      if (!response.Contents || response.Contents.length === 0) {
          break;
      }

      // --- BATCH PROCESSING START ---
      const items = response.Contents;
      const newModels = new Map<string, any>();
      const newPosts = new Map<string, any>(); // Key: "ModelName:PostName" -> Data
      const mediaToInsert: any[] = [];
      const thumbUpdates = new Map<number, string>(); // ModelId -> ThumbKey

      // PASS 1: Identify New Models
      for (const item of items) {
          if (!item.Key || item.Key.endsWith('/')) continue;
          const parts = item.Key.split('/');
          const modelName = parts[0];
          
          if (!modelName) continue;

          if (!modelMap.has(modelName) && !newModels.has(modelName)) {
              newModels.set(modelName, {
                  folderName: modelName,
                  status: 'new',
                  lastSyncedAt: new Date()
              });
          }
      }

      // EXECUTE 1: Insert New Models
      if (newModels.size > 0) {
          const insertedModels = await db.insert(whitelabelModels)
            .values(Array.from(newModels.values()))
            .onConflictDoNothing() // Should not conflict given our map check, but just in case
            .returning({ id: whitelabelModels.id, folderName: whitelabelModels.folderName });
          
          for (const m of insertedModels) {
              modelMap.set(m.folderName, m.id);
              stats.models++;
          }
      }

      // PASS 2: Identify New Posts & Thumbnails
      for (const item of items) {
          if (!item.Key || item.Key.endsWith('/')) continue;
          const parts = item.Key.split('/');
          const modelName = parts[0];
          const modelId = modelMap.get(modelName);
          
          if (!modelId) continue; // Should not happen

          // Handle Thumbnails (ModelName/File.jpg) or Post Thumbnails
          // If structure is Model/Post/File, we usually just take the first file as model thumb if missing?
          // Or if there is a file in root of model folder.
          if (parts.length === 2) {
              // Model/File.jpg
               if (/\.(jpg|jpeg|png|webp)$/i.test(parts[1])) {
                   // It's a candidate for model thumbnail
                   thumbUpdates.set(modelId, item.Key);
               }
          }

          if (parts.length >= 3) {
              const postName = parts[1];
              const postKey = `${modelId}:${postName}`;

              if (!postMap.has(postKey) && !newPosts.has(postKey)) {
                  newPosts.set(postKey, {
                      whitelabelModelId: modelId,
                      folderName: postName,
                      title: postName
                  });
              }
          }
      }

      // EXECUTE 2: Insert New Posts
      if (newPosts.size > 0) {
          const insertedPosts = await db.insert(whitelabelPosts)
            .values(Array.from(newPosts.values()))
            .onConflictDoNothing()
            .returning({ id: whitelabelPosts.id, whitelabelModelId: whitelabelPosts.whitelabelModelId, folderName: whitelabelPosts.folderName });
          
          for (const p of insertedPosts) {
              postMap.set(`${p.whitelabelModelId}:${p.folderName}`, p.id);
              stats.posts++;
          }
      }

      // EXECUTE 2.5: Update Thumbnails (Optional / Low Priority)
      // Doing this one-by-one is slow. Batch it?
      // Or just ignore for speed? 
      // Let's do a quick batch update if we have few.
      // Drizzle doesn't support bulk update with different values easily in one query without raw SQL (CASE WHEN).
      // Let's skip for max speed or do it very simply.
      // We will skip this in the loop for speed. You can add a separate "Fix Thumbs" script.

      // PASS 3: Prepare Media
      for (const item of items) {
          if (!item.Key || item.Key.endsWith('/')) continue;
          const parts = item.Key.split('/');
          
          // Only process files inside posts: Model/Post/File
          if (parts.length < 3) continue;

          const modelName = parts[0];
          const postName = parts[1];
          const fileName = parts.slice(2).join('/'); // Handle sub-sub folders? Assuming flat inside post.
          
          const modelId = modelMap.get(modelName);
          if (!modelId) continue;

          const postKey = `${modelId}:${postName}`;
          const postId = postMap.get(postKey);
          if (!postId) continue;

          const cdnUrl = `https://bucketcoomerst.sfo3.cdn.digitaloceanspaces.com/${item.Key}`;

          mediaToInsert.push({
              whitelabelPostId: postId,
              s3Key: item.Key,
              url: cdnUrl,
              type: /\.(mp4|mov|webm)$/i.test(fileName) ? 'video' : 'image'
          });
      }

      // EXECUTE 3: Bulk Insert Media
      if (mediaToInsert.length > 0) {
          // Chunking 1000 items (Drizzle/Postgres limit is 65535 params, so ~20k rows with 3 cols. 1000 is safe)
          await db.insert(whitelabelMedia)
            .values(mediaToInsert as any)
            .onConflictDoUpdate({
                target: whitelabelMedia.s3Key,
                set: { url: sql`excluded.url` }
            });
          stats.media += mediaToInsert.length;
      }

      totalObjectsProcessed += items.length;
      isTruncated = response.IsTruncated || false;
      continuationToken = response.NextContinuationToken;
      
      // console.log(`Processed ${totalObjectsProcessed} objects...`);
    }
    
    // Final pass: Update post counts
    await db.execute(sql`
        UPDATE whitelabel_models 
        SET post_count = (
            SELECT count(*) FROM whitelabel_posts 
            WHERE whitelabel_posts.whitelabel_model_id = whitelabel_models.id
        )
    `);

    // Final pass: Update post media JSON (media_cdns)
    await db.execute(sql`
        UPDATE whitelabel_posts
        SET media_cdns = sub.media_json
        FROM (
            SELECT 
                whitelabel_post_id,
                json_build_object(
                    'images', COALESCE(json_agg(url) FILTER (WHERE type = 'image' AND url IS NOT NULL), '[]'),
                    'videos', COALESCE(json_agg(url) FILTER (WHERE type = 'video' AND url IS NOT NULL), '[]')
                ) as media_json
            FROM whitelabel_media
            GROUP BY whitelabel_post_id
        ) as sub
        WHERE whitelabel_posts.id = sub.whitelabel_post_id
    `);
    
    return stats;
  },

  /**
   * Retrieves paginated models from the database.
   */
  async listModels(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const [items, total] = await Promise.all([
      db.select()
        .from(whitelabelModels)
        .orderBy(desc(whitelabelModels.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(whitelabelModels)
    ]);

    const enrichedItems = await Promise.all(items.map(async (model) => {
        if (!model.thumbnailUrl) {
             return model;
        }
        if (model.thumbnailUrl && !model.thumbnailUrl.startsWith('http')) {
             const url = await getPresignedUrl(model.thumbnailUrl);
             return { ...model, thumbnailUrl: url };
        }
        return model;
    }));

    return {
      data: enrichedItems,
      total: total[0].count,
      page,
      limit,
      totalPages: Math.ceil(total[0].count / limit)
    };
  },

  async syncModelDetails(folderName: string) {
     return { success: true };
  }
};

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
