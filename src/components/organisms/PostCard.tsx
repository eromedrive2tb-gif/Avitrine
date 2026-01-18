import { FC } from 'hono/jsx';
import { MediaCarousel } from '../molecules/MediaCarousel';
import { Avatar } from '../atoms/Avatar';

interface PostCardProps {
  post: any;
  model: any;
  displayName: string;
}

export const PostCard: FC<PostCardProps> = ({ post, model, displayName }) => {
  // Robust media type detection fallback
  const rawImages = (post.mediaCdns?.images || post.images || []);
  const rawVideos = (post.mediaCdns?.videos || post.videos || []);
  const allUrls = [...rawImages, ...rawVideos];
  
  // Regex updated to handle query parameters (presigned URLs) and more formats
  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov|m4v|mkv|avi|wmv|flv)(\?|$)/i.test(url);
  
  let mediaItems = allUrls.map(url => ({
    type: isVideo(url) ? 'video' : 'image',
    url
  }));
  
  if (mediaItems.length === 0) {
    mediaItems.push({ type: 'image', url: post.thumbnail || post.thumbnailUrl || '/static/img/placeholder.jpg' });
  }

  return (
    <div class="group bg-[#0f0f0f] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl transition-all hover:border-white/10">
      {/* Post Header */}
      <div class="p-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="shadow-lg border border-white/10 rounded-xl">
             <Avatar src={model.thumbnailUrl} alt={displayName} size="sm" />
          </div>
          <div>
            <p class="text-sm font-black tracking-tight">{displayName}</p>
            <div class="flex items-center gap-2">
               <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
               <p class="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{post.createdAt || 'Publicado Agora'}</p>
            </div>
          </div>
        </div>
        <a href={`/posts/${post.id}`} class="text-[10px] font-black bg-white/5 px-4 py-2 rounded-lg hover:bg-primary transition-all uppercase tracking-widest">Detalhes</a>
      </div>

      {/* Post Media Container */}
      <MediaCarousel mediaItems={mediaItems as any} postId={post.id} />

      {/* Post Legend */}
      {post.title && (
        <div class="px-6 pb-4">
          <p class="text-sm text-gray-300 leading-relaxed font-medium">{post.title}</p>
        </div>
      )}

      {/* Interaction Footer */}
      <div class="p-6 flex items-center justify-between border-t border-white/5">
        <div class="flex items-center gap-8">
            <button class="flex items-center gap-2 group/btn">
              <span class="text-xl group-hover/btn:scale-125 transition-transform">❤️</span>
              <span class="text-xs font-black text-gray-400 group-hover/btn:text-white">{post.likes || 0}</span>
            </button>
            <button class="flex items-center gap-2 group/btn">
              <span class="text-xl group-hover/btn:scale-125 transition-transform">💬</span>
              <span class="text-xs font-black text-gray-400 group-hover/btn:text-white">{post.comments || 0}</span>
            </button>
        </div>
      </div>
    </div>
  );
};
