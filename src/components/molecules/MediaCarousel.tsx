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
      class="post-carousel relative aspect-[4/5] md:aspect-video bg-black/60 overflow-hidden min-h-[300px] group" 
      data-post-id={postId} 
      style={{ aspectRatio: '0.8' }}
    >
      {mediaItems.map((item, idx) => (
        <div class={`carousel-item absolute inset-0 w-full h-full transition-opacity duration-300 ${idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          {item.type === 'video' ? (
            <div class="w-full h-full relative">
              <video src={item.url} class="w-full h-full object-cover" loop playsInline></video>
              <div class="play-button absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-colors z-20">
                <div class="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center pl-1 scale-90 group-hover:scale-100 transition-transform shadow-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </div>
          ) : (
            <img src={item.url} class="w-full h-full object-cover" loading="lazy" />
          )}
        </div>
      ))}

      {hasMultiple && (
        <>
          <button class="carousel-prev absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md z-30 cursor-pointer shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button class="carousel-next absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md z-30 cursor-pointer shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          
          <div class="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30 pointer-events-none">
            {mediaItems.map((_, i) => (
              <div class={`carousel-dot w-2 h-2 rounded-full transition-all cursor-pointer pointer-events-auto ${i === 0 ? 'bg-primary scale-125' : 'bg-white/40 hover:bg-white'}`}></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
