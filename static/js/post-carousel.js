class PostCarousel {
    constructor(element) {
        this.element = element;
        this.slides = element.querySelectorAll('.carousel-item');
        this.dots = element.querySelectorAll('.carousel-dot');
        this.counter = element.querySelector('.carousel-counter');
        this.prevBtn = element.querySelector('.carousel-prev');
        this.nextBtn = element.querySelector('.carousel-next');
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        
        // Touch state
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    init() {
        // Debug
        // console.log('Carousel init:', this.element, 'Slides:', this.totalSlides);

        // If only 1 slide, hide controls
        if (this.totalSlides <= 1) {
            if (this.prevBtn) this.prevBtn.style.display = 'none';
            if (this.nextBtn) this.nextBtn.style.display = 'none';
            if (this.dots) this.dots.forEach(d => d.style.display = 'none');
            // Still need to init video controls for the single slide if it's a video
            this.initVideoControls();
            return;
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.prev();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.next();
            });
        }

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.goTo(index);
            });
        });

        // Swipe Support
        this.element.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.element.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        this.initVideoControls();
        this.update(); // Set initial state
    }

    handleSwipe() {
        const threshold = 50; 
        if (this.touchEndX < this.touchStartX - threshold) {
            this.next();
        }
        if (this.touchEndX > this.touchStartX + threshold) {
            this.prev();
        }
    }

    initVideoControls() {
        this.slides.forEach(slide => {
             const video = slide.querySelector('video');
             const playBtn = slide.querySelector('.play-button');
             
             if (video && playBtn) {
                 const togglePlay = (e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     
                     if (video.paused) {
                         video.play();
                         playBtn.style.opacity = '0';
                         playBtn.style.pointerEvents = 'none';
                         video.setAttribute('controls', 'true');
                     } else {
                         video.pause();
                         playBtn.style.opacity = '1';
                         playBtn.style.pointerEvents = 'auto';
                         video.removeAttribute('controls');
                     }
                 };

                 playBtn.addEventListener('click', togglePlay);
                 
                 video.addEventListener('pause', () => {
                     playBtn.style.opacity = '1';
                     playBtn.style.pointerEvents = 'auto';
                     video.removeAttribute('controls');
                 });
                 
                 video.addEventListener('play', () => {
                     playBtn.style.opacity = '0';
                     playBtn.style.pointerEvents = 'none';
                     video.setAttribute('controls', 'true');
                 });
             }
        });
    }

    update() {
        this.slides.forEach((slide, index) => {
            if (index === this.currentIndex) {
                slide.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
                slide.classList.add('opacity-100', 'z-10');
            } else {
                slide.classList.remove('opacity-100', 'z-10');
                slide.classList.add('opacity-0', 'pointer-events-none', 'z-0');
                
                // Pause video if moving away
                const video = slide.querySelector('video');
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }
            }
        });

        this.dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('bg-primary', 'scale-125');
                dot.classList.remove('bg-white/20');
            } else {
                dot.classList.remove('bg-primary', 'scale-125');
                dot.classList.add('bg-white/20');
            }
        });

        // Update Counter
        if (this.counter) {
            this.counter.textContent = `${this.currentIndex + 1}/${this.totalSlides}`;
        }
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.update();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.update();
    }
    
    goTo(index) {
        this.currentIndex = index;
        this.update();
    }
}

window.initPostCarousels = () => {
    document.querySelectorAll('.post-carousel').forEach(el => {
        if (!el.dataset.initialized) {
            new PostCarousel(el);
            el.dataset.initialized = 'true';
        }
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initPostCarousels);
} else {
    window.initPostCarousels();
}