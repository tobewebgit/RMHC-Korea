/**
 * main-page.js — 메인 홈 페이지 전용 인터랙션 모듈
 *
 * 담당 기능:
 *  1. 섹션3 행사 슬라이드 (Swiper — volunteer.html 패턴 동일)
 *  2. 섹션4 감사 이야기 마키 (GSAP — yangsan.html initPartnerMarquee 패턴 동일)
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. 섹션3: 행사 슬라이드 (Swiper)
  //    참조: donate/volunteer.html vol-intro-swiper
  // =========================================================================
  const initEventsSwiper = () => {
    if (typeof Swiper === 'undefined') return;

    new Swiper('.main-events-swiper', {
      slidesPerView: 4,
      spaceBetween: 24,
      loop: false,
      navigation: {
        nextEl: '.main-events-swiper-next',
        prevEl: '.main-events-swiper-prev',
      },
      breakpoints: {
        0: {
          slidesPerView: 1.2,
          spaceBetween: 16,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
        1280: {
          slidesPerView: 4,
          spaceBetween: 24,
        },
      },
    });
  };

  // =========================================================================
  // 2. 섹션4: 감사 이야기 마키 (GSAP marquee)
  //    참조: houses/yangsan.html initPartnerMarquee — 100% 동일 패턴
  // =========================================================================
  const initStoryMarquee = () => {
    const slider = document.querySelector('.js-main-story');
    const track  = slider?.querySelector('.swiper-wrapper');
    const slides = track ? Array.from(track.querySelectorAll('.swiper-slide')) : [];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let marqueeTween = null;
    let resizeTimer  = null;

    if (!slider || !track || slides.length === 0) return;

    // 원본 슬라이드 마킹
    slides.forEach((slide) => {
      slide.dataset.marqueeOriginal = 'true';
    });

    const removeClones = () => {
      track.querySelectorAll('[data-marquee-clone="true"]').forEach((el) => el.remove());
    };

    // 폴백: overflow-x scroll로 전환
    const stopMarquee = () => {
      marqueeTween?.kill();
      marqueeTween = null;
      removeClones();
      slider.classList.add('is-fallback-slider');
      if (typeof gsap !== 'undefined') {
        gsap.set(track, { x: 0, clearProps: 'transform' });
      }
    };

    // 마키 생성 및 실행
    const createMarquee = () => {
      marqueeTween?.kill();
      marqueeTween = null;
      removeClones();

      if (typeof gsap === 'undefined' || reduceMotion.matches) {
        stopMarquee();
        return;
      }

      slider.classList.remove('is-fallback-slider');
      gsap.set(track, { x: 0 });

      // 클론 충분히 채우기
      const originals    = Array.from(track.querySelectorAll('[data-marquee-original="true"]'));
      const originalWidth = track.scrollWidth;
      const cloneRounds  = Math.max(1, Math.ceil(slider.offsetWidth / originalWidth) + 1);

      for (let r = 0; r < cloneRounds; r++) {
        originals.forEach((slide) => {
          const clone = slide.cloneNode(true);
          clone.dataset.marqueeClone = 'true';
          clone.removeAttribute('data-marquee-original');
          clone.setAttribute('aria-hidden', 'true');
          track.appendChild(clone);
        });
      }

      // 단위 이동 거리 = 원본 세트 너비 + gap 1개
      const gap        = 32; // 3.2rem → 32px (CSS gap 값과 맞춤)
      const unitWidth  = originalWidth + gap;

      marqueeTween = gsap.to(track, {
        x: `-=${unitWidth}`,
        duration: unitWidth / 80, // 80px/s 속도
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % unitWidth),
        },
      });
    };

    createMarquee();

    // 리사이즈 대응
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(createMarquee, 200);
    });

    // reduce-motion 변경 대응
    reduceMotion.addEventListener('change', () => {
      if (reduceMotion.matches) {
        stopMarquee();
      } else {
        createMarquee();
      }
    });
  };

  initEventsSwiper();
  initStoryMarquee();
});
