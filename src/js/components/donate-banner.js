export const initDonateBannerHeart = () => {
  const banner = document.querySelector('.donate-banner');
  const heart = banner?.querySelector('.donate-banner__heart');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timeline = null;

  if (!banner || !heart || typeof gsap === 'undefined') return;

  const reset = () => {
    timeline?.kill();
    timeline = null;
    const isMobile = window.innerWidth <= 1024;
    const startScale = isMobile ? 0.5 : 0.8; // 모바일에서는 더 작은 상태(0.5)에서 출발

    gsap.set(heart, {
      scale: startScale,
      opacity: 1,
      transformOrigin: '50% 50%',
    });
  };

  const play = () => {
    if (reduceMotion.matches) return;
    reset();
    const isMobile = window.innerWidth <= 1024;
    const targetScale = isMobile ? 1.05 : 1.0; // 모바일일 때 약 5% 더 크게 (1.05) 완료

    timeline = gsap.timeline();
    timeline.to(heart, {
      scale: targetScale,
      duration: 0.8,
      ease: 'back.out(1.25)',
    });
  };

  reset();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          play();
        } else {
          reset();
        }
      });
    },
    { threshold: 0.35 },
  );

  observer.observe(banner);
};
