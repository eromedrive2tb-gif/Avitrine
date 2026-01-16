import { FC } from 'hono/jsx';
import { Button } from '../atoms/Button';

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  category: string;
  isLive?: boolean;
}

export const HeroCarousel: FC = () => {
  const slides: HeroSlide[] = [
    { id: 1, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80", title: "ALESSANDRA V.", category: "CAM #1 BRASIL", isLive: true },
    { id: 2, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80", title: "GAMER NIGHT", category: "EVENTO EXCLUSIVO", isLive: true },
    { id: 3, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80", title: "SARAH JONES", category: "LANÇAMENTO 4K", isLive: false },
  ];

  return (
    <div class="relative w-full h-[45vh] md:h-[380px] rounded-xl overflow-hidden group border border-white/10 bg-black">
      
      {/* Slides Container */}
      <div id="carousel-track" class="w-full h-full relative">
        {slides.map((slide, index) => (
          <div 
            class={`carousel-slide absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            data-index={index}
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
                <Button variant="primary" className="!py-2 !px-6 text-sm">Assistir</Button>
                <Button variant="outline" className="!py-2 !px-6 text-sm">Perfil</Button>
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

      {/* Simple Inline JS for Carousel */}
      <script dangerouslySetInnerHTML={{ __html: `
        let currentSlide = 0;
        const totalSlides = ${slides.length};
        let interval;

        function updateSlides() {
            document.querySelectorAll('.carousel-slide').forEach((el, idx) => {
                el.style.opacity = idx === currentSlide ? '1' : '0';
                el.style.zIndex = idx === currentSlide ? '10' : '0';
            });
            document.querySelectorAll('[id^="indicator-"]').forEach((el, idx) => {
                el.style.backgroundColor = idx === currentSlide ? '#8A2BE2' : 'rgba(255,255,255,0.2)';
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlides();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlides();
        }

        function changeSlide(idx) {
            currentSlide = idx;
            updateSlides();
            resetTimer();
        }

        function resetTimer() {
            clearInterval(interval);
            interval = setInterval(nextSlide, 5000);
        }

        // Init
        updateSlides();
        resetTimer();
      `}} />

    </div>
  );
};
