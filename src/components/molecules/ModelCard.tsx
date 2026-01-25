import { FC } from 'hono/jsx';

interface ModelCardProps {
  name: string;
  imageUrl: string;
  category?: string;
  isLive?: boolean;
  views?: string;
  isPromoted?: boolean; // Type A: "Post" Ad
  link?: string; // Optional external link for ads
  adId?: number;
  placement?: string;
}

export const ModelCard: FC<ModelCardProps> = ({ 
  name, 
  imageUrl, 
  category = 'Model', 
  isLive = false,
  views = '1.2k',
  isPromoted = false,
  link,
  adId,
  placement
}) => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const href = link || `/models/${slug}`;
  const trackId = `ad-card-${adId}-${Math.random().toString(36).substr(2, 9)}`;
  const handleClick = adId ? `fetch('/api/ads/${adId}/click${placement ? `?placement=${placement}` : ''}', {method:'POST'})` : '';

  return (
    <a href={href} id={trackId} onclick={handleClick} class={`group relative w-full aspect-[3/4] rounded-md overflow-hidden cursor-pointer block transition-all duration-300 ${
      isPromoted 
        ? 'border-2 border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)]' 
        : 'bg-surface border border-white/5 hover:border-primary/50'
    }`}>
      {/* ... existing image and badges ... */}
      <img 
        src={imageUrl} 
        alt={name} 
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        loading="lazy"
      />
      
      {/* Promoted Badge */}
      {isPromoted && (
        <div class="absolute top-0 left-0 w-full bg-[#FFD700] text-black text-[10px] font-bold uppercase text-center py-0.5 z-30">
          Patrocinado
        </div>
      )}

      {/* Live Badge (Compact) */}
      {isLive && (
        <div class="absolute top-2 right-2 z-30">
          <span class="flex items-center gap-1 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">
            Live
          </span>
        </div>
      )}

      {/* Gradient Overlay (Always visible at bottom for text readability) */}
      <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent z-20"></div>

      {/* Content (Compact for Mobile) */}
      <div class="absolute bottom-0 left-0 w-full p-3 z-30">
        <h3 class="text-white text-sm md:text-base font-bold truncate leading-tight">{name}</h3>
        
        <div class="flex items-center justify-between mt-1">
          <span class="text-[10px] text-gray-400 uppercase tracking-wide truncate pr-2">{category}</span>
          <span class="text-[10px] text-primary flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
            👁 {views}
          </span>
        </div>
      </div>
      {adId && (
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  fetch('/api/ads/${adId}/impression${placement ? `?placement=${placement}` : ''}', {method:'POST'});
                  observer.unobserve(entry.target);
                }
              });
            }, { threshold: 0.1 });
            const el = document.getElementById('${trackId}');
            if (el) observer.observe(el);
          })();
        `}} />
      )}
    </a>
  );
};
