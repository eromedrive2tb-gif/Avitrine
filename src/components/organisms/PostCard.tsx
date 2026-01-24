import { FC } from 'hono/jsx';
import { MediaCarousel } from '../molecules/MediaCarousel';
import { Avatar } from '../atoms/Avatar';

interface PostCardProps {
  post: any;
  model: any;
  displayName: string;
  isSubscribed?: boolean;
}

export const PostCard: FC<PostCardProps> = ({ post, model, displayName, isSubscribed = false }) => {
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
            <Avatar src={model.iconUrl || model.thumbnailUrl} alt={displayName} size="sm" className="!rounded-full ring-2 ring-[#2a2a2a]" />
          </div>
          <div class="flex flex-col">
            <p class="text-sm font-bold text-gray-100 hover:text-[#8A2BE2] transition-colors cursor-pointer">{displayName}</p>
            <p class="text-[11px] text-gray-500 font-medium uppercase tracking-wider">{post.createdAt || 'Publicado Agora'}</p>
          </div>
        </div>
        <button class="action-btn !p-2 text-gray-500 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
        </button>
      </div>

      {/* 2. Media Block (Absolute Black) - with Premium Overlay */}
      <div class="stack-media relative overflow-hidden">
        <MediaCarousel mediaItems={mediaItems as any} postId={post.id} isBlurred={!isSubscribed} />
        
        {/* Premium Content Overlay - Only visible for non-subscribers */}
        {!isSubscribed && (
          <div class="premium-overlay absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/50">
            {/* Content Layer */}
            <div class="relative z-10 flex flex-col items-center text-center px-6">
              {/* Lock Icon */}
              <div class="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/20 shadow-lg">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="1.5" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                  class="w-8 h-8 text-white"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              
              {/* CTA Text */}
              <h3 class="text-lg font-bold text-white mb-2">Conteúdo Exclusivo</h3>
              <p class="text-sm text-gray-300 mb-5 max-w-[200px]">
                Assine para desbloquear este e outros conteúdos premium
              </p>
              
              {/* Subscribe Button */}
              <a 
                href="/plans" 
                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8A2BE2] to-[#9D4EDD] text-white text-sm font-bold rounded-full hover:from-[#7B27CC] hover:to-[#8E3FCC] transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
                Assinar Agora
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 3. Footer Block (Solid Graphite "Floor") */}
      <div class="stack-footer">

{/* Interaction Row */}
<div class="flex items-center justify-between mb-4">
    <div class="flex gap-6"> {/* Aumentei o gap de 4 para 6 para dar espaço aos números */}
      
      {/* Métrica de Likes */}
      <div class="flex items-center gap-1.5 group/item">
        <button class="action-btn group/like" aria-label="Like">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-6 h-6 group-active/like:scale-75 transition-transform">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <span class="text-sm font-semibold text-gray-400 group-hover/item:text-gray-200 transition-colors">
          {post.likes || 0}
        </span>
      </div>

      {/* Métrica de Donates ($) */}
      <div class="flex items-center gap-1.5 group/item">
        <button class="action-btn" aria-label="Send Money">
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="currentColor"
            style="width: 24px; height: 24px; color: inherit; opacity: 0.9;"
          >
            <g id="SVGRepo_iconCarrier">
              <g data-name="11. Phone" id="_11._Phone">
                <path d="M14,6a1,1,0,0,0,0-2H8A1,1,0,0,0,8,6Z"></path>
                <path d="M21,8.84v-4A4.8,4.8,0,0,0,16.21,0H5.79A4.8,4.8,0,0,0,1,4.79V27.21A4.8,4.8,0,0,0,5.79,32H16.21A4.8,4.8,0,0,0,21,27.21v-.05A10,10,0,0,0,21,8.84ZM16.21,30H5.79A2.79,2.79,0,0,1,3,27.21V4.79A2.79,2.79,0,0,1,5.79,2H16.21A2.79,2.79,0,0,1,19,4.79V8.2A10.2,10.2,0,0,0,17,8a9.92,9.92,0,0,0-7,2.89V10a1,1,0,0,0-2,0V26a1,1,0,0,0,2,0v-.89A9.92,9.92,0,0,0,17,28a10.19,10.19,0,0,0,1.93-.19A2.79,2.79,0,0,1,16.21,30ZM17,26a8,8,0,0,1-7-4.14V14.14A8,8,0,1,1,17,26Z"></path>
                <path d="M17,15h2a1,1,0,0,0,0-2H18a1,1,0,0,0-2,0v.18A3,3,0,0,0,17,19a1,1,0,0,1,0,2H15a1,1,0,0,0,0,2h1a1,1,0,0,0,2,0v-.18A3,3,0,0,0,17,17a1,1,0,0,1,0-2Z"></path>
                <path d="M30,5H27.41l.3-.29a1,1,0,1,0-1.42-1.42l-2,2a1,1,0,0,0,0,1.42l2,2a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L27.41,7H30a1,1,0,0,0,0-2Z"></path>
              </g>
            </g>
          </svg>
        </button>
        <span class="text-sm font-semibold text-gray-400 group-hover/item:text-gray-200 transition-colors">
          ${post.tipsTotal || 0}
        </span>
      </div>

    </div>
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