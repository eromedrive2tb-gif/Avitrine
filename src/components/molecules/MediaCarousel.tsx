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
            <div class="custom-video-wrapper w-full h-full relative group/video no-context-menu" onContextMenu={(e: any) => e.preventDefault()}>
              <video 
                src={item.url} 
                class="w-full h-full object-cover" 
                loop 
                playsInline 
                muted
                onContextMenu={(e: any) => e.preventDefault()}
              ></video>
              
              {/* Click Overlay to Play/Pause */}
              <div class="video-overlay absolute inset-0 cursor-pointer z-10"></div>

              {/* Center Play Animation Icon (Hidden by default, shown on pause) */}
              <div class="play-state-icon absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-opacity duration-200">
                <div class="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center pl-1 border border-white/10 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" class="opacity-90"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>

              {/* Bottom Controls Bar */}
              <div class="video-controls absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 z-30 flex items-center gap-3">
                 {/* Play/Pause Small Toggle */}
                 <button class="control-play-btn text-white hover:text-primary transition-colors">
                    <svg class="icon-play w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    <svg class="icon-pause w-5 h-5 hidden" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                 </button>

                 {/* Scrubber */}
                 <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value="0" 
                    step="0.1"
                    class="video-scrubber flex-1 h-1 bg-white/30 rounded-full appearance-none outline-none"
                 />

                 {/* Mute Toggle */}
                 <button class="control-mute-btn text-white hover:text-primary transition-colors">
                    <svg class="icon-muted w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" x2="1" y1="9" y2="9" transform="rotate(45 12 12)"/></svg>
                    <svg class="icon-unmuted w-5 h-5 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                 </button>
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
          <div class="carousel-counter absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold text-white border border-white/10 z-30">
            1/{mediaItems.length}
          </div>
        </>
      )}
    </div>
  );
};