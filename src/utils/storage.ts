import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Ensure these env vars are set in a real environment
const SPACES_ENDPOINT = process.env.DO_SPACES_ENDPOINT || "https://nyc3.digitaloceanspaces.com"; // Example region
const SPACES_KEY = process.env.DO_SPACES_KEY || "key";
const SPACES_SECRET = process.env.DO_SPACES_SECRET || "secret";
const BUCKET_NAME = process.env.DO_SPACES_BUCKET || "creatorflix";

const s3Client = new S3Client({
    endpoint: SPACES_ENDPOINT,
    region: "us-east-1", // DigitalOcean Spaces typically uses us-east-1 for compatibility
    credentials: {
        accessKeyId: SPACES_KEY,
        secretAccessKey: SPACES_SECRET
    }
});

export async function uploadToSpaces(file: ArrayBuffer, fileName: string, mimeType: string): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: new Uint8Array(file),
        ACL: 'public-read',
        ContentType: mimeType
    });

    try {
        await s3Client.send(command);
        // Return the public URL
        // Endpoint usually needs the bucket name as subdomain or path depending on config.
        // DO Spaces pattern: https://bucket.region.digitaloceanspaces.com/key
        const region = SPACES_ENDPOINT.split('.')[1]; // crude extraction, better to use env
        return `https://${BUCKET_NAME}.${region}.digitaloceanspaces.com/${fileName}`;
    } catch (error) {
        console.error("Error uploading to Spaces:", error);
        throw new Error("Upload failed");
    }
}
