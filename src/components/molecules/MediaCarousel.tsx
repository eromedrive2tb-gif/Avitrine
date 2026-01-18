import { FC } from 'hono/jsx';

interface MediaItem {
  type: 'video' | 'image';
  url: string;
}

interface MediaCarouselProps {
  mediaItems: MediaItem[];
  postId: string;
}

export const MediaCarousel: FC<MediaCarouselProps> = ({ mediaItems, postId }) => {
  const hasMultiple = mediaItems.length > 1;

  return (
    <div 
      class="post-carousel relative w-full aspect-[4/5] bg-[#1a1a1a] overflow-hidden group" 
      data-post-id={postId} 
    >
      {mediaItems.map((item, idx) => (
        <div class={`carousel-item absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          {item.type === 'video' ? (
            <div class="w-full h-full relative">
              <video src={item.url} class="w-full h-full object-cover" loop playsInline muted></video>
              <div class="play-button absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 hover:bg-black/30 transition-colors z-20">
                <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center pl-1 scale-90 group-hover:scale-100 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </div>
          ) : (
            <img src={item.url} class="w-full h-full object-cover" loading="lazy" alt="Post content" />
          )}
        </div>
      ))}

      {hasMultiple && (
        <>
          {/* Navigation Arrows - Only visible on desktop hover or always on mobile? 
              Let's make them subtle. */}
          <button class="carousel-prev absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white/90 flex items-center justify-center backdrop-blur-sm z-30 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#8A2BE2] hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button class="carousel-next absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white/90 flex items-center justify-center backdrop-blur-sm z-30 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#8A2BE2] hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          
          {/* Dots Indicator */}
          <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-30 pointer-events-none">
            {mediaItems.map((_, i) => (
              <div class={`carousel-dot w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer pointer-events-auto shadow-sm ${i === 0 ? 'bg-[#8A2BE2] w-4' : 'bg-white/50 hover:bg-white'}`}></div>
            ))}
          </div>
          
          {/* Multi-photo indicator badge (like Instagram) */}
          <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold text-white border border-white/10 z-30">
            1/{mediaItems.length}
          </div>
        </>
      )}
    </div>
  );
};