import { db } from '../../../db';
import { whitelabelPosts, whitelabelMedia } from '../../../db/schema';
import { desc, eq, count } from 'drizzle-orm';
import { signS3Key } from '../../s3';

export const WhitelabelPostQueries = {
  async getByModelId(modelId: number, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const posts = await db.select().from(whitelabelPosts)
      .where(eq(whitelabelPosts.whitelabelModelId, modelId))
      .orderBy(desc(whitelabelPosts.id))
      .limit(limit)
      .offset(offset);

    const formattedPosts = await Promise.all(posts.map(async (post) => {
      const media = typeof post.mediaCdns === 'string' ? JSON.parse(post.mediaCdns) : post.mediaCdns;
      
      const signedImages = await Promise.all((media?.images || []).map((img: string) => signS3Key(img)));
      const signedVideos = await Promise.all((media?.videos || []).map((vid: string) => signS3Key(vid)));

      const firstImage = signedImages[0] || null;

      return {
        ...post,
        thumbnail: firstImage,
        mediaCdns: {
          images: signedImages,
          videos: signedVideos
        }
      };
    }));

    return formattedPosts;
  },

  async getStats() {
      const [postCount] = await db.select({ count: count() }).from(whitelabelPosts);
      const [mediaCount] = await db.select({ count: count() }).from(whitelabelMedia);

      return {
          posts: postCount.count,
          media: mediaCount.count
      };
  }
};
