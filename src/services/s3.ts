import { 
  S3Client, 
  ListObjectsV2Command, 
  GetObjectCommand,
  type ListObjectsV2CommandOutput
} from "@aws-sdk/client-s3";
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
  forcePathStyle: false
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
   * Função desativada para uso em tempo real.
   * Retorna 0 para evitar travamentos.
   */
  async getGlobalStats() {
    return { totalModels: 0, cached: true };
  },

  async getFullModelData(folderName: string) {
    const modelPrefix = folderName.endsWith('/') ? folderName : `${folderName}/`;
    let isTruncated = true;
    let continuationToken: string | undefined = undefined;
    
    const postsMap = new Map<string, { files: string[], type: 'image' | 'video' }>();
    let thumbnail: string | null = null;

    while(isTruncated) {
        const command: ListObjectsV2Command = new ListObjectsV2Command({
            Bucket: S3_CONFIG.bucket,
            Prefix: modelPrefix,
            ContinuationToken: continuationToken
        });
        
        const response: ListObjectsV2CommandOutput = await s3Client.send(command);
        
        if (response.Contents) {
            for (const item of response.Contents) {
                if (!item.Key || item.Key.endsWith('/')) continue;
                if (!thumbnail && /\.(jpg|jpeg|png|webp)$/i.test(item.Key)) {
                    thumbnail = item.Key;
                }
                const relative = item.Key.replace(modelPrefix, '');
                const parts = relative.split('/');
                if (parts.length >= 2) {
                    const postId = parts[0];
                    if (!postsMap.has(postId)) {
                        postsMap.set(postId, { files: [], type: 'image' });
                    }
                    const post = postsMap.get(postId)!;
                    post.files.push(item.Key);
                    if (/\.(mp4|mov|webm)$/i.test(item.Key)) {
                        post.type = 'video';
                    }
                }
            }
        }
        isTruncated = response.IsTruncated || false;
        continuationToken = response.NextContinuationToken;
    }

    const posts = await Promise.all(Array.from(postsMap.entries()).map(async ([id, data]) => {
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
    
    // Timeout de segurança global para evitar loop infinito
    const startTime = Date.now();

    while (isTruncated) {
      if (Date.now() - startTime > 30000) break; // 30 segundos max

      const command = new ListObjectsV2Command({
        Bucket: S3_CONFIG.bucket,
        Delimiter: "/",
        MaxKeys: 1000,
        ContinuationToken: continuationToken
      });

      const response: ListObjectsV2CommandOutput = await s3Client.send(command);
      
      if (response.CommonPrefixes) {
          folders.push(...response.CommonPrefixes
            .map((p) => p.Prefix!) 
            .filter(Boolean)
          );
      }
      isTruncated = response.IsTruncated || false;
      continuationToken = response.NextContinuationToken;
    }
    return folders;
  }
};

async function getModelDetails(modelPrefix: string) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: S3_CONFIG.bucket,
      Prefix: modelPrefix,
      MaxKeys: 50
    });

    const response = await s3Client.send(command);
    const subfolders = new Set();
    let thumbnailKey: string | null = null;

    if (response.Contents) {
      for (const item of response.Contents) {
        if (!item.Key) continue;
        const relativePath = item.Key.replace(modelPrefix, '');
        const parts = relativePath.split('/');
        
        if (parts.length > 0 && parts[0] && parts[0] !== '') {
          subfolders.add(parts[0]);
        }

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