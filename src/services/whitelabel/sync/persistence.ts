import { db } from '../../../db';
import { whitelabelModels, whitelabelPosts, whitelabelMedia } from '../../../db/schema';
import { sql, inArray } from 'drizzle-orm';

export const WhitelabelPersistence = {
  async fetchKnownModels() {
    const allModels = await db.select({ id: whitelabelModels.id, folderName: whitelabelModels.folderName }).from(whitelabelModels);
    return new Map<string, number>(allModels.map(m => [m.folderName, m.id]));
  },

  async fetchKnownPosts() {
    const allPosts = await db.select({ id: whitelabelPosts.id, modelId: whitelabelPosts.whitelabelModelId, folderName: whitelabelPosts.folderName }).from(whitelabelPosts);
    // Key: "ModelID:PostFolderName"
    return new Map<string, number>(allPosts.map(p => [`${p.modelId}:${p.folderName}`, p.id]));
  },

  async insertModels(models: any[]) {
    if (models.length === 0) return [];
    return await db.insert(whitelabelModels)
      .values(models)
      .onConflictDoNothing()
      .returning({ id: whitelabelModels.id, folderName: whitelabelModels.folderName });
  },

  async deleteModels(modelIds: number[]) {
    if (modelIds.length === 0) return;
    await db.delete(whitelabelModels)
      .where(inArray(whitelabelModels.id, modelIds));
  },

  async insertPosts(posts: any[]) {
    if (posts.length === 0) return [];
    return await db.insert(whitelabelPosts)
      .values(posts)
      .onConflictDoNothing()
      .returning({ id: whitelabelPosts.id, whitelabelModelId: whitelabelPosts.whitelabelModelId, folderName: whitelabelPosts.folderName });
  },

  async deletePosts(postIds: number[]) {
    if (postIds.length === 0) return;
    await db.delete(whitelabelPosts)
      .where(inArray(whitelabelPosts.id, postIds));
  },

  async insertMedia(mediaItems: any[]) {
    if (mediaItems.length === 0) return;
    // Chunking could be added here if needed, but assuming caller handles sensible batch sizes
    await db.insert(whitelabelMedia)
      .values(mediaItems)
      .onConflictDoUpdate({
          target: whitelabelMedia.s3Key,
          set: { url: sql`excluded.url` }
      });
  },

  async updateModelProfile(modelId: number, data: { iconUrl?: string, bannerUrl?: string }) {
      if (!data.iconUrl && !data.bannerUrl) return;
      await db.update(whitelabelModels)
          .set(data)
          .where(sql`${whitelabelModels.id} = ${modelId}`);
  },
  
  async updateAggregates(specificModelId?: number) {
     const whereClause = specificModelId ? sql`WHERE id = ${specificModelId}` : sql``;
     const whereClausePosts = specificModelId ? sql`WHERE whitelabel_model_id = ${specificModelId}` : sql``;

     await db.execute(sql`
        UPDATE whitelabel_models 
        SET post_count = (
            SELECT count(*) FROM whitelabel_posts 
            WHERE whitelabel_posts.whitelabel_model_id = whitelabel_models.id
        )
        ${whereClause}
    `);

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
        ${specificModelId ? sql`AND whitelabel_posts.whitelabel_model_id = ${specificModelId}` : sql``}
    `);
  }
};
