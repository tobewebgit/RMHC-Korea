export const initDonateBannerHeart = () => {
  const banner = document.querySelector('.donate-banner');
  const heart = banner?.querySelector('.donate-banner__heart');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timeline = null;

  if (!banner || !heart || typeof gsap === 'undefined') return;

  const reset = () => {
    timeline?.kill();
    timeline = null;
    gsap.set(heart, {
      scale: 0.8,
      opacity: 1,
      transformOrigin: '50% 50%',
    });
  };

  const play = () => {
    if (reduceMotion.matches) return;
    reset();
    timeline = gsap.timeline();
    timeline.to(heart, {
      scale: 1,
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
