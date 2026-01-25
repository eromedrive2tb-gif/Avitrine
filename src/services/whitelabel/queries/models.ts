import { db } from '../../../db';
import { whitelabelModels, whitelabelPosts, whitelabelMedia, models } from '../../../db/schema';
import { desc, count, inArray, eq, and, sql, or } from 'drizzle-orm';
import { signS3Key } from '../../s3';

export const WhitelabelModelQueries = {
  async _enrichWithThumbnails(models: any[]) {
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

  async list(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const [items, total] = await Promise.all([
      db.select()
        .from(whitelabelModels)
        .orderBy(desc(whitelabelModels.createdAt), desc(whitelabelModels.id))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(whitelabelModels)
    ]);

    const enrichedItems = await WhitelabelModelQueries._enrichWithThumbnails(items);

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

    // Get whitelabel models
    const [wlModels, wlTotal] = await Promise.all([
      db.select({
        id: whitelabelModels.id,
        name: whitelabelModels.folderName,
        postCount: whitelabelModels.postCount,
        thumbnailUrl: whitelabelModels.thumbnailUrl,
      })
      .from(whitelabelModels)
      .orderBy(desc(whitelabelModels.postCount), desc(whitelabelModels.id))
      .limit(limit)
      .offset(offset),
      db.select({ count: count() }).from(whitelabelModels)
    ]);

    // Get active admin models (advertiser models)
    const adminModels = await db.select({
      id: models.id,
      name: models.name,
      postCount: models.postCount,
      thumbnailUrl: models.thumbnailUrl,
    })
    .from(models)
    .where(
      and(
        eq(models.status, 'active'),
        eq(models.isAdvertiser, true)
      )
    )
    .orderBy(desc(models.isFeatured), desc(models.createdAt))
    .limit(Math.min(4, limit)); // Limit advertiser models

    // Enrich whitelabel models with thumbnails
    const enrichedWlModels = await WhitelabelModelQueries._enrichWithThumbnails(wlModels);
    
    // Combine: advertiser models first, then whitelabel models
    const combinedModels = [...adminModels, ...enrichedWlModels];
    
    // Remove duplicates and limit
    const uniqueIds = new Set<number>();
    const uniqueModels = combinedModels.filter(m => {
      if (uniqueIds.has(m.id)) return false;
      uniqueIds.add(m.id);
      return true;
    }).slice(0, limit);
    
    return {
      data: uniqueModels,
      total: wlTotal[0].count + adminModels.length,
      page,
      limit,
      totalPages: Math.ceil((wlTotal[0].count + adminModels.length) / limit)
    };
  },

  async getBySlug(slug: string) {
    // First try to find in whitelabelModels
    const wlModel = await db.select().from(whitelabelModels)
      .where(eq(whitelabelModels.folderName, slug))
      .limit(1).then(res => res[0]);

    if (wlModel) {
      wlModel.thumbnailUrl = await signS3Key(wlModel.thumbnailUrl);
      wlModel.iconUrl = await signS3Key(wlModel.iconUrl);
      wlModel.bannerUrl = await signS3Key(wlModel.bannerUrl);
      return {
        ...wlModel,
        name: wlModel.folderName, // Compatibility
        source: 'whitelabel' as const
      };
    }

    // Then try to find in models table (admin-created models)
    const adminModel = await db.select().from(models)
      .where(
        and(
          or(
            eq(models.slug, slug),
            eq(models.name, slug)
          ),
          eq(models.status, 'active')
        )
      )
      .limit(1).then(res => res[0]);

    if (adminModel) {
      return {
        ...adminModel,
        folderName: adminModel.slug || adminModel.name, // Compatibility
        source: 'admin' as const
      };
    }

    return null;
  },

  async getStats() {
      const [modelCount] = await db.select({ count: count() }).from(whitelabelModels);
      return { count: modelCount.count };
  }
};
