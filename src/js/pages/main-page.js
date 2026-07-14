document.addEventListener('DOMContentLoaded', () => {
  const initMainKvMotion = () => {
    const visual = document.querySelector('.main-kv__visual');
    const content = document.querySelector('.main-kv__content');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!visual || typeof gsap === 'undefined') return;

    if (reduceMotion.matches) {
      gsap.set(visual, { x: '0%', opacity: 1, '--kv-heart-mask-size': '100%' });
      if (content) gsap.set(content, { x: '0%', opacity: 1 });
      return;
    }

    // 우측 visual 초기 상태
    gsap.set(visual, {
      x: '20%',
      opacity: 0,
      '--kv-heart-mask-size': '80%',
    });

    // 좌측 content 초기 상태 (좌측에서 슬라이드인)
    if (content) {
      gsap.set(content, { x: '-50%', opacity: 0 });
    }

    const tl = gsap.timeline({ delay: 0 });

    // 좌측 content: 좌 → 우 페이드인 (먼저 시작)
    if (content) {
      tl.to(content, {
        x: '0%',
        opacity: 1,
        duration: 2,
        ease: 'power3.out',
      });
    }

    // 우측 visual: 우 → 좌 페이드인 (content와 오버랩)
    tl.to(visual, {
        x: '0%',
        opacity: 1,
        duration: 1.65,
        ease: 'power3.out',
      }, content ? '-=0.9' : 0)
      .to(visual, {
        '--kv-heart-mask-size': '100%',
        duration: 1.35,
        ease: 'power2.out',
      }, '-=0.05');
  };

  const initMainQuickMotion = () => {
    const quick = document.querySelector('.main-quick');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!quick || typeof gsap === 'undefined') return;

    // prefers-reduced-motion 시 즉시 노출
    if (reduceMotion.matches) {
      gsap.set(quick, { opacity: 1, y: 0 });
      return;
    }

    // 초기 상태: 투명 + 아래로 내려진 상태로 숨김 (CSS에서도 opacity:0으로 초기 처리)
    gsap.set(quick, { opacity: 0, y: 100 });

    let animated = false;

    const playQuickMotion = () => {
      if (animated || window.scrollY <= 0) return;
      animated = true;

      gsap.to(quick, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
      });

      window.removeEventListener('scroll', onScroll, { passive: true });
    };

    const onScroll = () => playQuickMotion();

    // 이미 스크롤된 상태라면 즉시 실행
    if (window.scrollY > 0) {
      gsap.set(quick, { opacity: 1, y: 0 });
      return;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  };

  const initEventsSwiper = () => {
    const slider = document.querySelector('.main-events-swiper');
    if (!slider || typeof Swiper === 'undefined') return;

    new Swiper(slider, {
      slidesPerView: 4,
      spaceBetween: 24,
      loop: false,
      navigation: {
        nextEl: '.main-events-swiper-next',
        prevEl: '.main-events-swiper-prev',
      },
      breakpoints: {
        0: {
          slidesPerView: 1.12,
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

  const initThanksMarquee = () => {
    const slider = document.querySelector('.js-main-story');
    const track = slider?.querySelector('.swiper-wrapper');
    const slides = track ? Array.from(track.querySelectorAll('.swiper-slide')) : [];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 768px)');
    let marqueeTween = null;
    let resizeTimer = null;

    if (!slider || !track || slides.length === 0) return;

    slides.forEach((slide) => {
      slide.dataset.marqueeOriginal = 'true';
    });

    const removeClones = () => {
      track.querySelectorAll('[data-marquee-clone="true"]').forEach((clone) => clone.remove());
    };

    const stopMarquee = () => {
      marqueeTween?.kill();
      marqueeTween = null;
      removeClones();
      slider.classList.add('is-fallback-slider');
      if (typeof gsap !== 'undefined') {
        gsap.set(track, { x: 0, clearProps: 'transform' });
      }
    };

    const createMarquee = () => {
      marqueeTween?.kill();
      marqueeTween = null;
      removeClones();

      if (typeof gsap === 'undefined' || reduceMotion.matches || mobile.matches) {
        stopMarquee();
        return;
      }

      slider.classList.remove('is-fallback-slider');
      gsap.set(track, { x: 0 });

      const originals = Array.from(track.querySelectorAll('[data-marquee-original="true"]'));
      const gap = parseFloat(window.getComputedStyle(track).columnGap || '32') || 32;
      const originalWidth = track.scrollWidth;
      const cloneRounds = Math.max(2, Math.ceil(slider.offsetWidth / originalWidth) + 2);

      for (let round = 0; round < cloneRounds; round += 1) {
        originals.forEach((slide) => {
          const clone = slide.cloneNode(true);
          clone.dataset.marqueeClone = 'true';
          clone.removeAttribute('data-marquee-original');
          clone.setAttribute('aria-hidden', 'true');
          track.appendChild(clone);
        });
      }

      const unitWidth = originalWidth + gap;
      marqueeTween = gsap.to(track, {
        x: `-=${unitWidth}`,
        duration: unitWidth / 70,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % unitWidth),
        },
      });
    };

    const pauseMarquee = () => {
      marqueeTween?.pause();
    };

    const playMarquee = () => {
      if (!reduceMotion.matches && !mobile.matches) marqueeTween?.resume();
    };

    slider.addEventListener('mouseenter', pauseMarquee);
    slider.addEventListener('mouseleave', playMarquee);
    slider.addEventListener('focusin', pauseMarquee);
    slider.addEventListener('focusout', playMarquee);

    createMarquee();

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(createMarquee, 180);
    });

    reduceMotion.addEventListener('change', createMarquee);
    mobile.addEventListener('change', createMarquee);
  };

  const initPartnerSlider = () => {
    const slider = document.querySelector('[data-main-partner-slider]');
    const wrapper = slider?.querySelector('.swiper-wrapper');
    const pagination = document.querySelector('.main-partners .partner-swiper-pagination');
    const mobile = window.matchMedia('(max-width: 768px)');
    const logoCount = 100;
    let swiper = null;
    let currentChunkSize = 0;

    if (!slider || !wrapper || !pagination || typeof Swiper === 'undefined') return;

    const getChunkSize = () => (mobile.matches ? 18 : 24);

    const createLogo = (num) => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.src = new URL(`../../images/partner/logo_main_partner_${num}.png`, import.meta.url).href;
      img.alt = `파트너 로고 ${num}`;
      img.width = 230;
      img.height = 84;
      img.loading = 'lazy';
      li.appendChild(img);
      return li;
    };

    const buildSlides = () => {
      const chunkSize = getChunkSize();
      if (chunkSize === currentChunkSize && wrapper.children.length > 0) return;

      currentChunkSize = chunkSize;
      swiper?.destroy(true, true);
      swiper = null;
      wrapper.innerHTML = '';

      for (let start = 1; start <= logoCount; start += chunkSize) {
        const slide = document.createElement('div');
        const list = document.createElement('ul');
        const end = Math.min(start + chunkSize - 1, logoCount);

        slide.className = 'swiper-slide';
        list.className = 'main-partner-grid';
        list.setAttribute('aria-label', `파트너 로고 ${start}번부터 ${end}번까지`);

        for (let num = start; num <= end; num += 1) {
          list.appendChild(createLogo(num));
        }

        slide.appendChild(list);
        wrapper.appendChild(slide);
      }

      swiper = new Swiper(slider, {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: pagination,
          clickable: true,
        },
      });
    };

    buildSlides();
    mobile.addEventListener('change', buildSlides);
  };

  const initDonateBannerHeart = () => {
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

  const initMainPopupSwiper = () => {
    // 팝업 엘리먼트가 없으면 즉시 종료 (주석 처리 시 오류 방지)
    const overlay = document.getElementById('modal-ma_01p');
    if (!overlay) return;

    const slider = overlay.querySelector('.main-popup-swiper');

    // 팝업 자동 노출
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Swiper 라이브러리 또는 슬라이더 없으면 종료
    if (!slider || typeof Swiper === 'undefined') return;

    const slides = slider.querySelectorAll('.swiper-slide');

    if (slides.length <= 1) {
      // 슬라이드 1개: dot 숨김, Swiper 초기화 안 함
      slider.classList.add('is-single');
      return;
    }

    // 슬라이드 2개 이상: Swiper 활성화
    new Swiper(slider, {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      pagination: {
        el: slider.querySelector('.main-popup-pagination'),
        clickable: true,
      },
    });
  };

  initMainKvMotion();
  initMainQuickMotion();
  initEventsSwiper();
  initThanksMarquee();
  initPartnerSlider();
  initDonateBannerHeart();
  // initMainPopupSwiper(); // 팝업 임시 비활성화 — 재개 시 주석 해제
});
