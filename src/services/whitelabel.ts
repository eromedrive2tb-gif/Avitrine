import { WhitelabelSyncService } from './whitelabel/sync';
import { WhitelabelModelQueries } from './whitelabel/queries/models';
import { WhitelabelPostQueries } from './whitelabel/queries/posts';

export const WhitelabelDbService = {
  // Sync Methods
  syncModelsFromBucket: WhitelabelSyncService.syncAllModels.bind(WhitelabelSyncService),
  syncModelDetails: WhitelabelSyncService.syncModelDetails.bind(WhitelabelSyncService),
  
  // Model Queries
  listModels: WhitelabelModelQueries.list,
  getTopModelsWithThumbnails: WhitelabelModelQueries.getTopWithThumbnails,
  getModelBySlug: WhitelabelModelQueries.getBySlug,
  
  // Post Queries
  getModelPosts: WhitelabelPostQueries.getByModelId,
  
  // Stats
  getStats: async () => {
    const m = await WhitelabelModelQueries.getStats();
    const p = await WhitelabelPostQueries.getStats();
    return { models: m.count, posts: p.posts, media: p.media };
  }
};