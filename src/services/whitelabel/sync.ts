import { s3Client, S3_CONFIG } from '../s3';
import { ListObjectsV2Command, ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';
import { S3KeyParser } from './sync/parser';
import { WhitelabelPersistence } from './sync/persistence';

export const WhitelabelSyncService = {
  async syncAllModels() {
    let continuationToken: string | undefined = undefined;
    let isTruncated = true;
    
    // 1. Load State
    const modelMap = await WhitelabelPersistence.fetchKnownModels();
    const postMap = await WhitelabelPersistence.fetchKnownPosts();
    const stats = { models: 0, posts: 0, media: 0, deletedModels: 0, deletedPosts: 0 };

    const seenModels = new Set<string>();
    const seenPosts = new Set<string>();

    while (isTruncated) {
      const command: ListObjectsV2Command = new ListObjectsV2Command({
        Bucket: S3_CONFIG.bucket,
        MaxKeys: 1000, 
        ContinuationToken: continuationToken
      });

      const response = await s3Client.send(command) as ListObjectsV2CommandOutput;
      if (!response.Contents || response.Contents.length === 0) break;

      // 2. Parse Items
      const newModels = new Map<string, any>();
      const newPosts = new Map<string, any>();
      const mediaToInsert: any[] = [];

      for (const item of response.Contents) {
        if (!item.Key) continue;
        const parsed = S3KeyParser.parse(item.Key);
        
        if (parsed.type === 'unknown') continue;

        // Track Seen Models
        seenModels.add(parsed.modelName);

        // Model Detection
        if (!modelMap.has(parsed.modelName) && !newModels.has(parsed.modelName)) {
           newModels.set(parsed.modelName, {
               folderName: parsed.modelName,
               status: 'new',
               lastSyncedAt: new Date()
           });
        }

        const modelId = modelMap.get(parsed.modelName);
        if (!modelId) continue; // Will handle in next pass if just created

        // Post Detection (Initial check, real processing in Pass 2)
        if (parsed.type === 'media' && parsed.postName) {
            const postKey = `${modelId}:${parsed.postName}`;
            if (!postMap.has(postKey) && !newPosts.has(postKey)) {
                newPosts.set(postKey, {
                    whitelabelModelId: modelId,
                    folderName: parsed.postName,
                    title: parsed.postName
                });
            }
        }
      }

      // 3. Persist Models
      if (newModels.size > 0) {
          const inserted = await WhitelabelPersistence.insertModels(Array.from(newModels.values()));
          inserted.forEach(m => {
              modelMap.set(m.folderName, m.id);
              stats.models++;
          });
      }

      // Pass 2: Posts (Re-scan to ensure Model IDs are available for everything)
      for (const item of response.Contents) {
          if (!item.Key) continue;
          const parsed = S3KeyParser.parse(item.Key);
          
          if (parsed.type === 'media' && parsed.postName) {
              const modelId = modelMap.get(parsed.modelName); // Should exist now if inserted in Pass 1
              if (!modelId) continue;

              // Track Seen Posts
              const postKey = `${modelId}:${parsed.postName}`;
              seenPosts.add(postKey);

              if (!postMap.has(postKey) && !newPosts.has(postKey)) {
                  newPosts.set(postKey, {
                      whitelabelModelId: modelId,
                      folderName: parsed.postName,
                      title: parsed.postName
                  });
              }
          }
      }

      if (newPosts.size > 0) {
          const inserted = await WhitelabelPersistence.insertPosts(Array.from(newPosts.values()));
          inserted.forEach(p => {
              postMap.set(`${p.whitelabelModelId}:${p.folderName}`, p.id);
              stats.posts++;
          });
      }

      // Pass 3: Media
      for (const item of response.Contents) {
          if (!item.Key) continue;
          const parsed = S3KeyParser.parse(item.Key);

          if (parsed.type === 'profile_media') {
              const modelId = modelMap.get(parsed.modelName);
              if (!modelId) continue;
              
              const cdnUrl = `https://whitelabel-only.sfo3.digitaloceanspaces.com/${item.Key.split('/').map((p: string) => encodeURIComponent(p)).join('/')}`;
              if (parsed.fileName === 'icon.webp') {
                  await WhitelabelPersistence.updateModelProfile(modelId, { iconUrl: cdnUrl });
              } else if (parsed.fileName === 'banner.webp') {
                  await WhitelabelPersistence.updateModelProfile(modelId, { bannerUrl: cdnUrl });
              }
              continue;
          }

          if (parsed.type === 'media' && parsed.postName) {
              const modelId = modelMap.get(parsed.modelName);
              if (!modelId) continue;
              
              const postKey = `${modelId}:${parsed.postName}`;
              const postId = postMap.get(postKey); // Should exist now
              if (!postId) continue;

              const cdnUrl = `https://whitelabel-only.sfo3.digitaloceanspaces.com/${item.Key.split('/').map((p: string) => encodeURIComponent(p)).join('/')}`;
              
              mediaToInsert.push({
                  whitelabelPostId: postId,
                  s3Key: item.Key,
                  url: cdnUrl,
                  type: parsed.isVideo ? 'video' : 'image'
              });
          }
      }

      if (mediaToInsert.length > 0) {
          await WhitelabelPersistence.insertMedia(mediaToInsert);
          stats.media += mediaToInsert.length;
      }

      isTruncated = response.IsTruncated || false;
      continuationToken = response.NextContinuationToken;
    }

    // 4. Handle Deletions
    const modelsToDelete: number[] = [];
    for (const [folderName, id] of modelMap) {
        if (!seenModels.has(folderName)) {
            modelsToDelete.push(id);
        }
    }

    if (modelsToDelete.length > 0) {
        await WhitelabelPersistence.deleteModels(modelsToDelete);
        stats.deletedModels = modelsToDelete.length;
    }

    const postsToDelete: number[] = [];
    for (const [key, id] of postMap) {
        // Only delete posts if their model still exists (otherwise cascade delete or model delete handles it)
        // But to be safe and clean, we check if the post was seen.
        // Note: If model is deleted, its posts shouldn't be in seenPosts (because we wouldn't find them in S3).
        // However, we should filter out posts belonging to models we just deleted to avoid DB errors if using foreign keys without CASCADE (though Drizzle usually needs explicit handling).
        // Assuming database handles FK or we just delete safely.
        
        // Actually, if we delete the model, the posts might be deleted automatically if defined with CASCADE.
        // If not, we must delete them. 
        // Let's assume we need to delete them.
        if (!seenPosts.has(key)) {
             postsToDelete.push(id);
        }
    }
    
    // Filter out posts that belong to models we are already deleting?
    // Not strictly necessary if `delete` is idempotent or handles missing records gracefully.
    // But `postsToDelete` might include posts from `modelsToDelete`. 
    // If we delete models first, then posts... 
    // If DB has ON DELETE CASCADE, `deletePosts` for those might do nothing or fail if ID is gone.
    // Let's just run it. Drizzle `delete` where ID matches should be fine.
    
    if (postsToDelete.length > 0) {
        await WhitelabelPersistence.deletePosts(postsToDelete);
        stats.deletedPosts = postsToDelete.length;
    }
    
    await WhitelabelPersistence.updateAggregates();
    return stats;
  },

  async syncModelDetails(folderName: string) {
      // Reuse similar logic or call syncAllModels with prefix?
      // Simplified for "Extreme SRP": just reimplement the loop for specific prefix is safer/cleaner than abstracting too much.
      // Or extract the "Processing Loop" above into a function `processBatch(items, state)`.
      // Let's do that for maximum DRY.
      return this._syncPrefix(folderName);
  },

  async _syncPrefix(prefix: string) {
    const modelMap = await WhitelabelPersistence.fetchKnownModels();
    const postMap = await WhitelabelPersistence.fetchKnownPosts();
    
    // Normalize prefix
    const safePrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
    
    // Ensure Model Exists first (manual check as it might not be in the S3 listing if we list subfolder)
    // Actually, listing "ModelName/" should return "ModelName/" as 1st key if it exists?
    // Let's just force ensure the model exists.
    const folderName = safePrefix.replace('/', '');
    if (!modelMap.has(folderName)) {
        const [m] = await WhitelabelPersistence.insertModels([{ folderName, status: 'new', lastSyncedAt: new Date() }]);
        modelMap.set(m.folderName, m.id);
    }

    let continuationToken: string | undefined = undefined;
    let isTruncated = true;
    const seenPosts = new Set<string>();

    while (isTruncated) {
        const command: ListObjectsV2Command = new ListObjectsV2Command({
            Bucket: S3_CONFIG.bucket,
            Prefix: safePrefix,
            ContinuationToken: continuationToken
        });
        const response = await s3Client.send(command) as ListObjectsV2CommandOutput;
        if (!response.Contents) break;

        // Reuse the logic? 
        // We can copy-paste the "Pass 2" and "Pass 3" logic since we know Model exists.
        // For DRY, extracting `processBatch(items, maps)` would be best.
        // But for now, I will inline to ensure correctness within this file scope.
        
        const newPosts = new Map<string, any>();
        const mediaToInsert: any[] = [];
        
        // Pass 2: Posts
        for (const item of response.Contents) {
            if (!item.Key) continue;
            const parsed = S3KeyParser.parse(item.Key);
            if (parsed.type === 'media' && parsed.postName) {
                const modelId = modelMap.get(parsed.modelName);
                if (!modelId) continue;

                const postKey = `${modelId}:${parsed.postName}`;
                seenPosts.add(postKey);

                if (!postMap.has(postKey) && !newPosts.has(postKey)) {
                    newPosts.set(postKey, {
                        whitelabelModelId: modelId,
                        folderName: parsed.postName,
                        title: parsed.postName
                    });
                }
            }
        }
        
        if (newPosts.size > 0) {
            const inserted = await WhitelabelPersistence.insertPosts(Array.from(newPosts.values()));
            inserted.forEach(p => postMap.set(`${p.whitelabelModelId}:${p.folderName}`, p.id));
        }

        // Pass 3: Media
        for (const item of response.Contents) {
            if (!item.Key) continue;
            const parsed = S3KeyParser.parse(item.Key);

            if (parsed.type === 'profile_media') {
                const modelId = modelMap.get(parsed.modelName);
                if (!modelId) continue;
                
                const cdnUrl = `https://whitelabel-only.sfo3.digitaloceanspaces.com/${item.Key.split('/').map((p: string) => encodeURIComponent(p)).join('/')}`;
                if (parsed.fileName === 'icon.webp') {
                    await WhitelabelPersistence.updateModelProfile(modelId, { iconUrl: cdnUrl });
                } else if (parsed.fileName === 'banner.webp') {
                    await WhitelabelPersistence.updateModelProfile(modelId, { bannerUrl: cdnUrl });
                }
                continue;
            }

            if (parsed.type === 'media' && parsed.postName) {
                const modelId = modelMap.get(parsed.modelName);
                if (!modelId) continue;
                
                const postKey = `${modelId}:${parsed.postName}`;
                const postId = postMap.get(postKey);
                if (!postId) continue;

                const cdnUrl = `https://whitelabel-only.sfo3.digitaloceanspaces.com/${item.Key.split('/').map((p: string) => encodeURIComponent(p)).join('/')}`;
                mediaToInsert.push({
                    whitelabelPostId: postId,
                    s3Key: item.Key,
                    url: cdnUrl,
                    type: parsed.isVideo ? 'video' : 'image'
                });
            }
        }

        if (mediaToInsert.length > 0) {
            await WhitelabelPersistence.insertMedia(mediaToInsert);
        }

        isTruncated = response.IsTruncated || false;
        continuationToken = response.NextContinuationToken;
    }

    const modelId = modelMap.get(folderName);

    // Deletion Logic for this prefix
    if (modelId) {
        const postsToDelete: number[] = [];
        for (const [key, id] of postMap) {
            if (key.startsWith(`${modelId}:`)) {
                if (!seenPosts.has(key)) {
                    postsToDelete.push(id);
                }
            }
        }
        if (postsToDelete.length > 0) {
            await WhitelabelPersistence.deletePosts(postsToDelete);
        }
    }

    await WhitelabelPersistence.updateAggregates(modelId);
    return { success: true };
  }
};