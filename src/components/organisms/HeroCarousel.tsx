import { FC } from 'hono/jsx';
import { Button } from '../atoms/Button';
import { MockService } from '../../services/mock';

interface HeroCarouselProps {
  slides?: any[];
}

export const HeroCarousel: FC<HeroCarouselProps> = ({ slides: customSlides }) => {
  const slides = customSlides || [];

  if (slides.length === 0) return null;

  return (
    <div class="relative w-full h-[45vh] md:h-[380px] rounded-xl overflow-hidden group border border-white/10 bg-black">
      
      {/* Slides Container */}
      <div id="carousel-track" class="w-full h-full relative">
        {slides.map((slide, index) => (
            <div 
            class={`carousel-slide absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            data-index={index}
            data-ad-id={slide.adId}
            data-placement={slide.placement || 'home_top'}
          >
            <img src={slide.image} class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
            
            {/* Content */}
            <div class="absolute bottom-0 left-0 p-8 max-w-lg z-20">
              <div class="flex items-center gap-3 mb-2">
                {slide.isLive && (
                    <span class="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">LIVE</span>
                )}
                <span class="text-primary font-bold text-xs uppercase tracking-widest">{slide.category}</span>
              </div>
              <h2 class="text-4xl md:text-5xl font-display text-white mb-4 leading-none">{slide.title}</h2>
              <div class="flex gap-3">
                <a href={slide.link || '#'} onclick={slide.adId ? `fetch('/api/ads/${slide.adId}/click', {method:'POST'})` : ''}>
                  <Button variant="primary" className="!py-2 !px-6 text-sm">Acessar</Button>
                </a>
                {slide.modelSlug && (
                  <a href={`/models/${slide.modelSlug}`}>
                    <Button variant="outline" className="!py-2 !px-6 text-sm">Perfil</Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div class="absolute bottom-4 right-4 z-30 flex gap-2">
         {slides.map((_, index) => (
            <button 
                onclick={`changeSlide(${index})`}
                class="w-3 h-3 rounded-full bg-white/20 hover:bg-white transition-colors data-[active=true]:bg-primary"
                id={`indicator-${index}`}
            ></button>
         ))}
      </div>
      
      {/* Arrows */}
      <button onclick="nextSlide()" class="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/50 hover:bg-primary text-white flex items-center justify-center rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">➜</button>
      <button onclick="prevSlide()" class="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/50 hover:bg-primary text-white flex items-center justify-center rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rotate-180">➜</button>

      <script src="/static/js/carousel.js" defer></script>
    </div>
  );
};
