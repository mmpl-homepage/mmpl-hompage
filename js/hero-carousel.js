(function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-bg-slide');
  const dotsContainer = document.querySelector('.hero-dots');
  if (slides.length < 2) return;

  let current = 0;
  let timer = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dotsContainer) dotsContainer.children[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    if (dotsContainer) dotsContainer.children[current].classList.add('active');
  }

  function startAutoplay() {
    timer = setInterval(() => goTo((current + 1) % slides.length), 5000);
  }

  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = i === 0 ? 'active' : '';
      dot.setAttribute('aria-label', '슬라이드 이동');
      dot.addEventListener('click', () => {
        clearInterval(timer);
        goTo(i);
        startAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  startAutoplay();
})();
