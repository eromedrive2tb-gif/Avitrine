
let currentSlide = 0;
// We will set totalSlides when the DOM is ready or pass it
let totalSlides = 0;
let interval;

function updateSlides() {
    const slides = document.querySelectorAll('.carousel-slide');
    totalSlides = slides.length;
    
    slides.forEach((el, idx) => {
        const isActive = idx === currentSlide;
        el.style.opacity = isActive ? '1' : '0';
        el.style.zIndex = isActive ? '10' : '0';
        
        // Track impression for active slide if it's an ad and hasn't been tracked yet
        if (isActive && el.dataset.adId && !el.dataset.tracked) {
            const adId = el.dataset.adId;
            const placement = el.dataset.placement || 'home_top';
            fetch(`/api/ads/${adId}/impression?placement=${placement}`, { method: 'POST' });
            el.dataset.tracked = 'true';
        }
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

document.addEventListener('DOMContentLoaded', () => {
    // Only init if carousel exists
    if(document.querySelector('.carousel-slide')) {
        updateSlides();
        resetTimer();
    }
});

// Expose functions to global scope for onclick handlers
window.changeSlide = changeSlide;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
