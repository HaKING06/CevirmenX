(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = document.querySelectorAll('.workflow > div, .section-intro, .cards article, .browser-section .button, .support, .note');
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
    targets.forEach((element, index) => {
      element.classList.add('reveal');
      element.style.setProperty('--delay', (index % 3) * 70 + 'ms');
      observer.observe(element);
    });
    document.body.classList.add('motion-ready');
    reduced.addEventListener('change', event => {
      if (event.matches) { observer.disconnect(); document.body.classList.remove('motion-ready'); }
    });
  }
  const preview = document.querySelector('.preview');
  const replay = document.getElementById('preview-replay');
  let replayTimer;
  replay?.addEventListener('click', () => {
    clearTimeout(replayTimer);
    preview.classList.remove('is-playing');
    requestAnimationFrame(() => requestAnimationFrame(() => preview.classList.add('is-playing')));
    replayTimer = setTimeout(() => preview.classList.remove('is-playing'), 1400);
  });
  const progress = document.querySelector('.reading-progress');
  let scheduled = false;
  function updateScroll() {
    const maximum = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${maximum > 0 ? Math.min(1, scrollY / maximum) : 0})`;
    scheduled = false;
  }
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }, { passive:true });
  addEventListener('resize', updateScroll);
  updateScroll();
})();
