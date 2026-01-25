import { WhitelabelSyncService } from './whitelabel/sync';
import { WhitelabelModelQueries } from './whitelabel/queries/models';
import { WhitelabelPostQueries } from './whitelabel/queries/posts';
import { AdminPostsService } from './admin/posts';

export const WhitelabelDbService = {
  // Sync Methods
  syncModelsFromBucket: WhitelabelSyncService.syncAllModels.bind(WhitelabelSyncService),
  syncModelDetails: WhitelabelSyncService.syncModelDetails.bind(WhitelabelSyncService),
  
  // Model Queries
  listModels: WhitelabelModelQueries.list,
  getTopModelsWithThumbnails: WhitelabelModelQueries.getTopWithThumbnails,
  getModelBySlug: WhitelabelModelQueries.getBySlug,
  
  // Post Queries
  getModelPosts: async (modelId: number, page: number = 1, limit: number = 20) => {
    // Primeiro verificar se o modelId corresponde a uma modelo administrativa
    try {
      const db = await import('../db').then(m => m.db);
      const { models } = await import('../db/schema');
      const { eq } = await import('drizzle-orm');
      
      const adminModel = await db
        .select()
        .from(models)
        .where(eq(models.id, modelId))
        .limit(1);
      
      // Se for uma modelo administrativa, buscar apenas posts administrativos
      if (adminModel.length > 0) {
        const { posts } = await import('../db/schema');
        const { desc } = await import('drizzle-orm');
        
        const adminPosts = await db
          .select()
          .from(posts)
          .where(eq(posts.modelId, modelId))
          .orderBy(desc(posts.createdAt))
          .limit(limit)
          .offset((page - 1) * limit);
        
        return await AdminPostsService.formatForPublic(adminPosts);
      }
    } catch (e) {
      console.error('Erro ao verificar modelo administrativa:', e);
    }
    
    // Se não for modelo administrativa, buscar posts do whitelabel
    try {
      const whitelabelPosts = await WhitelabelPostQueries.getByModelId(modelId, page, limit);
      return whitelabelPosts;
    } catch (e) {
      console.error('Erro ao buscar posts whitelabel:', e);
      return [];
    }
  },
  
  // Stats
  getStats: async () => {
    const m = await WhitelabelModelQueries.getStats();
    const p = await WhitelabelPostQueries.getStats();
    return { models: m.count, posts: p.posts, media: p.media };
  }
};