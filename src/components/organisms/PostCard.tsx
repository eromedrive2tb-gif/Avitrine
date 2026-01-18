import { FC } from 'hono/jsx';
import { MediaCarousel } from '../molecules/MediaCarousel';
import { Avatar } from '../atoms/Avatar';

interface PostCardProps {
  post: any;
  model: any;
  displayName: string;
}

export const PostCard: FC<PostCardProps> = ({ post, model, displayName }) => {
  // Robust media type detection
  const rawImages = (post.mediaCdns?.images || post.images || []);
  const rawVideos = (post.mediaCdns?.videos || post.videos || []);
  const allUrls = [...rawImages, ...rawVideos];
  
  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov|m4v|mkv|avi|wmv|flv)(\?|$)/i.test(url);
  
  let mediaItems = allUrls.map(url => ({
    type: isVideo(url) ? 'video' : 'image',
    url
  }));
  
  if (mediaItems.length === 0) {
    mediaItems.push({ type: 'image', url: post.thumbnail || post.thumbnailUrl || '/static/img/placeholder.jpg' });
  }

  return (
    <div class="premium-stack-card group">
      
      {/* 1. Header Block (Darker Graphite) */}
      <div class="stack-header">
        <div class="flex items-center gap-3">
          <div class="relative">
             <Avatar src={model.thumbnailUrl} alt={displayName} size="sm" className="!rounded-full ring-2 ring-[#2a2a2a]" />
          </div>
          <div class="flex flex-col">
            <p class="text-sm font-bold text-gray-100 hover:text-[#8A2BE2] transition-colors cursor-pointer">{displayName}</p>
            <p class="text-[11px] text-gray-500 font-medium uppercase tracking-wider">{post.createdAt || 'Publicado Agora'}</p>
          </div>
        </div>
        <button class="action-btn !p-2 text-gray-500 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      {/* 2. Media Block (Absolute Black) */}
      <div class="stack-media">
        <MediaCarousel mediaItems={mediaItems as any} postId={post.id} />
      </div>

      {/* 3. Footer Block (Solid Graphite "Floor") */}
      <div class="stack-footer">
        
        {/* Interaction Row */}
        <div class="flex items-center justify-between mb-4">
          <div class="flex gap-4">
            <button class="action-btn group/like" aria-label="Like">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="group-active/like:scale-75 transition-transform"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
            <button class="action-btn" aria-label="Comment">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
            <button class="action-btn" aria-label="Share">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
          <button class="action-btn">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          </button>
        </div>

        {/* Likes */}
        <div class="mb-2">
           <p class="text-sm font-bold text-white">{post.likes || 0} curtidas</p>
        </div>

        {/* Caption */}
        {post.title && (
          <div class="mb-2">
            <p class="text-sm text-gray-300 leading-relaxed">
              <span class="font-bold text-white mr-2">{displayName}</span>
              {post.title}
            </p>
          </div>
        )}
        
        {/* Comments Link */}
        {(post.comments > 0) && (
          <button class="text-gray-500 text-xs hover:text-gray-300 transition-colors mt-1 font-medium">
            Ver todos os {post.comments} comentários
          </button>
        )}
      </div>
    </div>
  );
};