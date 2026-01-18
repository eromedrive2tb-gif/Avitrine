import { db } from '../../../db';
import { whitelabelModels, whitelabelPosts, whitelabelMedia } from '../../../db/schema';
import { desc, count, inArray, eq, and, sql } from 'drizzle-orm';
import { signS3Key } from '../../s3';

export const WhitelabelModelQueries = {
  async list(page: number = 1, limit: number = 20) {
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
        if (model.thumbnailUrl) {
           return { ...model, thumbnailUrl: await signS3Key(model.thumbnailUrl) };
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

  async getTopWithThumbnails(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const models = await db.select({
      id: whitelabelModels.id,
      name: whitelabelModels.folderName,
      postCount: whitelabelModels.postCount,
      thumbnailUrl: whitelabelModels.thumbnailUrl,
    })
    .from(whitelabelModels)
    .orderBy(desc(whitelabelModels.postCount))
    .limit(limit)
    .offset(offset);

    if (models.length === 0) return [];

    const modelIds = models.map(m => m.id);
    
    const thumbnails = await db.selectDistinctOn([whitelabelPosts.whitelabelModelId], {
      modelId: whitelabelPosts.whitelabelModelId,
      s3Key: whitelabelMedia.s3Key,
    })
    .from(whitelabelMedia)
    .innerJoin(whitelabelPosts, eq(whitelabelMedia.whitelabelPostId, whitelabelPosts.id))
    .where(
      and(
        inArray(whitelabelPosts.whitelabelModelId, modelIds),
        eq(whitelabelMedia.type, 'image'),
        sql`${whitelabelMedia.s3Key} ~* '\.(jpg|jpeg|png|webp|gif)$'`
      )
    )
    .orderBy(whitelabelPosts.whitelabelModelId, desc(whitelabelPosts.id), whitelabelMedia.id);

    return await Promise.all(models.map(async (model) => {
      const thumbData = thumbnails.find(t => t.modelId === model.id);
      const keyToSign = model.thumbnailUrl || thumbData?.s3Key || null;
      return {
        ...model,
        thumbnailUrl: await signS3Key(keyToSign)
      };
    }));
  },

  async getBySlug(slug: string) {
    const model = await db.select().from(whitelabelModels)
      .where(eq(whitelabelModels.folderName, slug))
      .limit(1).then(res => res[0]);

    if (!model) return null;

    model.thumbnailUrl = await signS3Key(model.thumbnailUrl);
    model.iconUrl = await signS3Key(model.iconUrl);
    model.bannerUrl = await signS3Key(model.bannerUrl);
    return model;
  },

  async getStats() {
      const [modelCount] = await db.select({ count: count() }).from(whitelabelModels);
      return { count: modelCount.count };
  }
};
