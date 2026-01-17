
let currentSlide = 0;
// We will set totalSlides when the DOM is ready or pass it
let totalSlides = 0;
let interval;

function updateSlides() {
    const slides = document.querySelectorAll('.carousel-slide');
    totalSlides = slides.length;
    
    slides.forEach((el, idx) => {
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
