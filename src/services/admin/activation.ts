import { db } from '../../db';
import { models, posts, whitelabelModels } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { WhitelabelDbService } from '../whitelabel';
import { AdminMappers } from './mappers';

export const AdminActivationService = {
  async activateModels(activateAll: boolean, specificModel?: string) {
    const folders = await this._getFoldersToProcess(activateAll, specificModel);
    let stats = { processedCount: 0, newModelsCount: 0, newPostsCount: 0 };

    for (const folder of folders) {
      const folderStats = await this._processFolder(folder);
      stats.processedCount++;
      stats.newModelsCount += folderStats.newModels;
      stats.newPostsCount += folderStats.newPosts;
    }

    return stats;
  },

  async _getFoldersToProcess(all: boolean, specific?: string) {
    if (specific) return [specific];
    if (all) {
       const res = await db.select({ folderName: whitelabelModels.folderName }).from(whitelabelModels);
       return res.map(m => m.folderName);
    }
    return [];
  },

  async _processFolder(folder: string) {
      // 1. Sync Data
      await WhitelabelDbService.syncModelDetails(folder);

      // 2. Fetch Staging Data
      const cachedModel = await db.query.whitelabelModels.findFirst({
        where: eq(whitelabelModels.folderName, folder),
        with: { posts: { with: { media: true } } }
      });

      if (!cachedModel) return { newModels: 0, newPosts: 0 };

      // 3. Upsert Model
      const { modelId, isNew } = await this._upsertModel(cachedModel);

      // 4. Upsert Posts
      const newPosts = await this._upsertPosts(modelId, cachedModel.posts);

      // 5. Mark Active
      await db.update(whitelabelModels)
        .set({ status: 'active' })
        .where(eq(whitelabelModels.id, cachedModel.id));

      return { newModels: isNew ? 1 : 0, newPosts };
  },

  async _upsertModel(cachedModel: any) {
    const existingModel = await db.query.models.findFirst({
      where: eq(models.name, cachedModel.folderName)
    });

    if (existingModel) return { modelId: existingModel.id, isNew: false };

    const mappedData = await AdminMappers.mapModelToProduction(cachedModel);
    const [inserted] = await db.insert(models).values(mappedData).returning();
    return { modelId: inserted.id, isNew: true };
  },

  async _upsertPosts(modelId: number, stagingPosts: any[]) {
    let count = 0;
    for (const post of stagingPosts) {
      const mappedPost = await AdminMappers.mapPostToProduction(post, modelId);
      if (!mappedPost) continue;

      const existing = await db.query.posts.findFirst({
        where: eq(posts.contentUrl, mappedPost.contentUrl)
      });

      if (!existing) {
        await db.insert(posts).values(mappedPost);
        count++;
      }
    }
    return count;
  }
};