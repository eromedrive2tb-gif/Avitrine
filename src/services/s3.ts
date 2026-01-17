import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3_CONFIG = {
  region: "sfo3",
  endpoint: "https://sfo3.digitaloceanspaces.com",
  credentials: {
    accessKeyId: "DO009RPG3PDRWU7HUL77",
    secretAccessKey: "fTdSHA/OhKK09x6qjXA86wN8eQiUZUKAx2YzT/GO8nw",
  },
  bucket: "bucketcoomerst"
};

const s3Client = new S3Client({
  region: S3_CONFIG.region,
  endpoint: S3_CONFIG.endpoint,
  credentials: S3_CONFIG.credentials,
  forcePathStyle: false // DigitalOcean Spaces usually works better with this false, but sometimes true depends on SDK version.
});

// Helper to generate signed URLs
async function getPresignedUrl(key: string): Promise<string> {
  if (!key) return '';
  try {
    const command = new GetObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
    });
    // Link valid for 1 hour
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error(`Error signing URL for ${key}:`, error);
    return '';
  }
}

export interface WhitelabelModel {
  folderName: string;
  thumbnailUrl: string | null;
  postCount: number;
  status: 'New' | 'Active';
}

export interface PaginatedResult {
  models: WhitelabelModel[];
  nextToken?: string;
  isTruncated: boolean;
}

export const WhitelabelService = {
  /**
   * Lista modelos com paginação real via S3
   */
  async listModels(continuationToken?: string, limit = 20): Promise<PaginatedResult> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: S3_CONFIG.bucket,
        Delimiter: "/",
        MaxKeys: limit,
        ContinuationToken: continuationToken ? decodeURIComponent(continuationToken) : undefined
      });

      const response = await s3Client.send(command);
      
      if (!response.CommonPrefixes) {
        return { models: [], isTruncated: false };
      }

      // Processamento Paralelo para buscar detalhes de cada modelo visível
      const modelsData = await Promise.all(response.CommonPrefixes.map(async (prefix) => {
        const folderName = prefix.Prefix?.replace('/', '') || 'Unknown';
        const details = await getModelDetails(prefix.Prefix!);

        return {
          folderName: folderName,
          thumbnailUrl: details.thumbnail 
            ? await getPresignedUrl(details.thumbnail)
            : null,
          postCount: details.subFolderCount,
          status: 'New' as const
        };
      }));

      return {
        models: modelsData,
        nextToken: response.NextContinuationToken ? encodeURIComponent(response.NextContinuationToken) : undefined,
        isTruncated: response.IsTruncated || false
      };

    } catch (error) {
      console.error("S3 List Error:", error);
      throw error;
    }
  },

  /**
   * Estatísticas Globais (Operação Pesada - Cachear em prod)
   * Faz um loop apenas nos prefixos para contar total de modelos sem buscar detalhes
   */
  async getGlobalStats() {
    let totalModels = 0;
    let continuationToken: string | undefined = undefined;
    let isTruncated = true;

    try {
        // Loop rápido apenas listando pastas raiz
        while (isTruncated) {
          const command = new ListObjectsV2Command({
            Bucket: S3_CONFIG.bucket,
            Delimiter: "/",
            MaxKeys: 1000, // Máximo permitido pela AWS
            ContinuationToken: continuationToken
          });
          const response = await s3Client.send(command);
          totalModels += response.CommonPrefixes?.length || 0;
          isTruncated = response.IsTruncated || false;
          continuationToken = response.NextContinuationToken;
          
          // Basic timeout protection: if it takes too many iterations (e.g. > 50k models), maybe stop? 
          // For now we keep it exact as requested, but log usage.
          // console.log(`Stats scan: ${totalModels} models found...`);
        }
    } catch (e) {
        console.error("Error getting global stats:", e);
        // Return whatever we counted so far instead of crashing
    }

    return { totalModels };
  },

  async getFullModelData(folderName: string) {
    const modelPrefix = folderName.endsWith('/') ? folderName : `${folderName}/`;
    
    // List all objects in the model folder
    let isTruncated = true;
    let continuationToken: string | undefined = undefined;
    
    const postsMap = new Map<string, { files: string[], type: 'image' | 'video' }>();
    let thumbnail: string | null = null;

    while(isTruncated) {
        const command = new ListObjectsV2Command({
            Bucket: S3_CONFIG.bucket,
            Prefix: modelPrefix,
            ContinuationToken: continuationToken
        });
        
        const response = await s3Client.send(command);
        
        if (response.Contents) {
            for (const item of response.Contents) {
                if (!item.Key || item.Key.endsWith('/')) continue;
                
                // Check for thumbnail (first image in root or anywhere if not found yet)
                if (!thumbnail && /\.(jpg|jpeg|png|webp)$/i.test(item.Key)) {
                    thumbnail = item.Key;
                }

                // Analyze structure: Model/PostID/File
                const relative = item.Key.replace(modelPrefix, '');
                const parts = relative.split('/');
                
                if (parts.length >= 2) {
                    const postId = parts[0]; // Subfolder is the post ID
                    const file = item.Key;
                    
                    if (!postsMap.has(postId)) {
                        postsMap.set(postId, { files: [], type: 'image' });
                    }
                    
                    const post = postsMap.get(postId)!;
                    post.files.push(file);
                    
                    // Detect type based on extension
                    if (/\.(mp4|mov|webm)$/i.test(file)) {
                        post.type = 'video';
                    }
                }
            }
        }
        
        isTruncated = response.IsTruncated || false;
        continuationToken = response.NextContinuationToken;
    }

    const posts = await Promise.all(Array.from(postsMap.entries()).map(async ([id, data]) => {
        // Pick a video as contentUrl if available and type is video, otherwise first file
        const videoFile = data.files.find(f => /\.(mp4|mov|webm)$/i.test(f));
        const contentFile = videoFile || data.files[0];
        
        return {
            id,
            type: data.type,
            contentUrl: contentFile ? await getPresignedUrl(contentFile) : ''
        };
    }));

    return {
        folderName: folderName.replace('/', ''),
        thumbnailUrl: thumbnail ? await getPresignedUrl(thumbnail) : null,
        posts
    };
  },

  async listAllModelFolders() {
    let folders: string[] = [];
    let continuationToken: string | undefined = undefined;
    let isTruncated = true;

    while (isTruncated) {
      const command = new ListObjectsV2Command({
        Bucket: S3_CONFIG.bucket,
        Delimiter: "/",
        MaxKeys: 1000,
        ContinuationToken: continuationToken
      });
      const response = await s3Client.send(command);
      if (response.CommonPrefixes) {
          folders.push(...response.CommonPrefixes.map(p => p.Prefix!).filter(Boolean));
      }
      isTruncated = response.IsTruncated || false;
      continuationToken = response.NextContinuationToken;
    }
    return folders;
  }
};

// Helper interno otimizado
async function getModelDetails(modelPrefix: string) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: S3_CONFIG.bucket,
      Prefix: modelPrefix,
      MaxKeys: 50 // Reduzido para scan mais rápido
    });

    const response = await s3Client.send(command);
    const subfolders = new Set();
    let thumbnailKey: string | null = null;

    if (response.Contents) {
      for (const item of response.Contents) {
        if (!item.Key) continue;
        const relativePath = item.Key.replace(modelPrefix, '');
        const parts = relativePath.split('/');
        
        // Pega primeira pasta como Post ID
        if (parts.length > 0 && parts[0] && parts[0] !== '') {
          subfolders.add(parts[0]);
        }

        // Prioriza jpg/png para thumbnail
        if (!thumbnailKey && /\.(jpg|jpeg|png|webp)$/i.test(item.Key)) {
          thumbnailKey = item.Key;
        }
      }
    }

    return {
      subFolderCount: subfolders.size,
      thumbnail: thumbnailKey
    };
  } catch (error) {
    return { subFolderCount: 0, thumbnail: null };
  }
}