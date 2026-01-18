export interface ParsedS3Item {
  type: 'model' | 'post' | 'media' | 'profile_media' | 'unknown';
  modelName: string;
  postName?: string;
  fileName?: string;
  isImage?: boolean;
  isVideo?: boolean;
}

export const S3KeyParser = {
  parse(key: string): ParsedS3Item {
    if (!key || key.endsWith('/')) return { type: 'unknown', modelName: '' };

    const parts = key.split('/');
    const modelName = parts[0];

    if (!modelName) return { type: 'unknown', modelName: '' };

    // Case 1: Model Thumbnail? "ModelName/file.jpg"
    if (parts.length === 2) {
      const fileName = parts[1];
      const isImage = /\.(jpg|jpeg|png|webp)$/i.test(fileName);
      if (isImage) {
        return { type: 'model', modelName, fileName, isImage: true };
      }
    }

    // Case 2: Post Content "ModelName/PostName/file.ext"
    if (parts.length >= 3) {
      const postName = parts[1];
      
      // Special Case: Profile Folder
      if (postName === 'profile') {
          const fileName = parts.slice(2).join('/');
          const isImage = /\.(jpg|jpeg|png|webp)$/i.test(fileName);
          if (isImage) {
              return { type: 'profile_media', modelName, fileName, isImage: true };
          }
          return { type: 'unknown', modelName };
      }

      const fileName = parts.slice(2).join('/');
      const isVideo = /\.(mp4|mov|webm|m4v|mkv|avi|wmv|flv)$/i.test(fileName);
      const isImage = !isVideo; // Simplification or add specific check

      return { 
        type: 'media', 
        modelName, 
        postName, 
        fileName,
        isImage,
        isVideo
      };
    }

    return { type: 'unknown', modelName };
  }
};
