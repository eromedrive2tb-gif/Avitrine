import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const S3_CONFIG = {
  region: "sfo3",
  endpoint: "https://sfo3.digitaloceanspaces.com",
  credentials: {
    accessKeyId: "DO00N8MHEPAM98V3JXAG",
    secretAccessKey: "QiBWGdSZkzoEbnBzFHss/VLnMTJb7wLyJC1towj0Kpw",
  },
  bucket: "whitelabel-only"
};

export const s3Client = new S3Client({
  region: S3_CONFIG.region,
  endpoint: S3_CONFIG.endpoint,
  credentials: S3_CONFIG.credentials,
  forcePathStyle: false
});

/**
 * Signs an S3 key to create a temporary accessible URL.
 * Handles full URLs (stripping domain) and special characters.
 */
export async function signS3Key(key: string | null): Promise<string | null> {
  if (!key) return null;
  try {
    let finalKey = key;
    if (key.startsWith('http')) {
      const url = new URL(key);
      finalKey = decodeURIComponent(url.pathname.substring(1));
    }
    if (finalKey.includes('%%')) {
        finalKey = finalKey.replace(/%%/g, '%25');
    }

    const command = new GetObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: finalKey,
    });
    // Link valid for 1 hour
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error(`Error signing URL for ${key}:`, error);
    return null;
  }
}
