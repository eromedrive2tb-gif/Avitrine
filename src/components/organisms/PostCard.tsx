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
    <div class="group relative bg-[#121212] rounded-[16px] overflow-hidden border border-[#222] transition-all duration-300 hover:scale-[1.005] hover:border-[#8A2BE2]/50 hover:shadow-[0_0_20px_rgba(138,43,226,0.15)]">
      
      {/* Post Header */}
      <div class="p-4 flex items-center justify-between bg-gradient-to-b from-white/[0.02] to-transparent">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="absolute -inset-0.5 bg-gradient-to-tr from-[#8A2BE2] to-[#222] rounded-full opacity-70 blur-[1px] group-hover:opacity-100 transition-opacity"></div>
            <div class="relative rounded-full bg-[#121212] p-[2px]">
               <Avatar src={model.thumbnailUrl} alt={displayName} size="sm" className="!rounded-full" />
            </div>
          </div>
          <div class="flex flex-col">
            <p class="text-sm font-bold text-white tracking-wide group-hover:text-[#8A2BE2] transition-colors">{displayName}</p>
            <p class="text-[11px] text-gray-500 font-medium uppercase tracking-wider">{post.createdAt || 'Publicado Agora'}</p>
          </div>
        </div>
        
        <button class="text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      {/* Post Legend (Above Media for better engagement context, or kept below as per standard? Standard is usually below or overlay. Directives didn't specify, but I'll keep it cleaner. Let's put it below media like Instagram, or above like Twitter. I'll stick to structure but improved styling.) 
         Actually, let's keep it below media as in the original, but refine typography.
      */}

      {/* Post Media Container */}
      <div class="w-full bg-black">
        <MediaCarousel mediaItems={mediaItems as any} postId={post.id} />
      </div>

      {/* Interaction Bar */}
      <div class="px-4 pt-3 pb-2 flex items-center justify-between">
        <div class="flex items-center gap-4">
            <button class="flex items-center gap-2 group/like focus:outline-none">
              <span class="text-2xl transition-transform group-active/like:scale-75 group-hover/like:text-[#8A2BE2] text-white">♡</span> 
              {/* Note: In a real app we'd toggle filled heart */}
            </button>
            <button class="flex items-center gap-2 group/comment focus:outline-none">
              <span class="text-2xl transition-transform group-hover/comment:-translate-y-0.5 text-white">💬</span>
            </button>
            <button class="flex items-center gap-2 group/share focus:outline-none">
              <span class="text-2xl transition-transform group-hover/share:rotate-12 text-white">✈️</span>
            </button>
        </div>
        
        <button class="text-white hover:text-[#8A2BE2] transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
        </button>
      </div>
      
      {/* Likes Count */}
      <div class="px-4 pb-1">
        <p class="text-sm font-bold text-white">
          {post.likes || 0} curtidas
        </p>
      </div>

      {/* Post Legend/Caption */}
      {post.title && (
        <div class="px-4 pb-4 pt-1">
          <p class="text-sm text-gray-300 leading-relaxed">
            <span class="font-bold text-white mr-2">{displayName}</span>
            {post.title}
          </p>
        </div>
      )}
      
      {/* View all comments */}
      {(post.comments > 0) && (
        <div class="px-4 pb-4">
          <button class="text-gray-500 text-xs hover:text-gray-300 transition-colors">
            Ver todos os {post.comments} comentários
          </button>
        </div>
      )}

    </div>
  );
};