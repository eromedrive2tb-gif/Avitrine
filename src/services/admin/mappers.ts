import { signS3Key } from '../s3';

export const AdminMappers = {
  async mapModelToProduction(whitelabelModel: any) {
    let thumbUrl = whitelabelModel.thumbnailUrl;
    if (thumbUrl && !thumbUrl.startsWith('http')) {
        const signed = await signS3Key(thumbUrl);
        if (signed) thumbUrl = signed;
    }

    return {
      name: whitelabelModel.folderName,
      iconUrl: thumbUrl,
      bannerUrl: thumbUrl,
      description: `Model imported from S3: ${whitelabelModel.folderName}`,
      isFeatured: false,
      isAdvertiser: false
    };
  },

  async mapPostToProduction(stagingPost: any, modelId: number) {
    const videoMedia = stagingPost.media.find((m: any) => m.type === 'video');
    const mainMedia = videoMedia || stagingPost.media[0];
    
    if (!mainMedia) return null;

    let contentUrl = mainMedia.s3Key;
    const signedContentUrl = await signS3Key(contentUrl);

    if (!signedContentUrl) return null;

    return {
      modelId: modelId,
      title: stagingPost.title || stagingPost.folderName,
      contentUrl: signedContentUrl,
      type: mainMedia.type as 'image' | 'video'
    };
  }
};
