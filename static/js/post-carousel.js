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
             const wrapper = slide.querySelector('.custom-video-wrapper');
             if (!wrapper) return;

             const video = wrapper.querySelector('video');
             const overlay = wrapper.querySelector('.video-overlay');
             const playStateIcon = wrapper.querySelector('.play-state-icon');
             
             // Controls
             const playBtn = wrapper.querySelector('.control-play-btn');
             const scrubber = wrapper.querySelector('.video-scrubber');
             const muteBtn = wrapper.querySelector('.control-mute-btn');
             
             // Icons
             const iconPlay = playBtn?.querySelector('.icon-play');
             const iconPause = playBtn?.querySelector('.icon-pause');
             const iconMuted = muteBtn?.querySelector('.icon-muted');
             const iconUnmuted = muteBtn?.querySelector('.icon-unmuted');

             if (!video) return;

             const updatePlayState = (playing) => {
                 if (playing) {
                     if (playStateIcon) {
                        playStateIcon.style.opacity = '0';
                        playStateIcon.style.transform = 'scale(1.5)';
                        setTimeout(() => playStateIcon.style.display = 'none', 200);
                     }
                     if (iconPlay) iconPlay.classList.add('hidden');
                     if (iconPause) iconPause.classList.remove('hidden');
                 } else {
                     if (playStateIcon) {
                        playStateIcon.style.display = 'flex';
                        playStateIcon.offsetHeight; // Force reflow
                        playStateIcon.style.opacity = '1';
                        playStateIcon.style.transform = 'scale(1)';
                     }
                     if (iconPlay) iconPlay.classList.remove('hidden');
                     if (iconPause) iconPause.classList.add('hidden');
                 }
             };

             const togglePlay = (e) => {
                 if(e) { e.preventDefault(); e.stopPropagation(); }
                 if (video.paused) {
                     video.play();
                     updatePlayState(true);
                 } else {
                     video.pause();
                     updatePlayState(false);
                 }
             };

             const toggleMute = (e) => {
                 if(e) { e.preventDefault(); e.stopPropagation(); }
                 video.muted = !video.muted;
                 if (video.muted) {
                     if (iconMuted) iconMuted.classList.remove('hidden');
                     if (iconUnmuted) iconUnmuted.classList.add('hidden');
                 } else {
                     if (iconMuted) iconMuted.classList.add('hidden');
                     if (iconUnmuted) iconUnmuted.classList.remove('hidden');
                 }
             };

             // Event Listeners
             if (overlay) overlay.addEventListener('click', togglePlay);
             if (playBtn) playBtn.addEventListener('click', togglePlay);
             if (muteBtn) muteBtn.addEventListener('click', toggleMute);

             // Scrubber Logic
             if (scrubber) {
                 video.addEventListener('timeupdate', () => {
                     const percent = (video.currentTime / video.duration) * 100;
                     scrubber.value = percent || 0;
                     // Update track fill
                     scrubber.style.background = `linear-gradient(to right, #8A2BE2 0%, #8A2BE2 ${percent}%, rgba(255,255,255,0.2) ${percent}%, rgba(255,255,255,0.2) 100%)`;
                 });

                 scrubber.addEventListener('input', (e) => {
                     const time = (e.target.value / 100) * video.duration;
                     video.currentTime = time;
                 });
             }

             // Ensure context menu is blocked
             video.addEventListener('contextmenu', e => e.preventDefault());
             wrapper.addEventListener('contextmenu', e => e.preventDefault());
             if (overlay) overlay.addEventListener('contextmenu', e => e.preventDefault());
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