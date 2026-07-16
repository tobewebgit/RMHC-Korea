/**
 * Swiper 인스턴스가 화면에 보일 때만 자동재생되도록 제어하는 공통 함수
 * @param {Object} swiperInstance - Swiper 인스턴스
 * @param {Element} targetElement - 화면 노출 기준이 될 요소 (일반적으로 slider 컨테이너나 부모 섹션)
 * @param {number} threshold - 화면 진입 비율 (0 ~ 1, 기본값 0.2)
 * @returns {IntersectionObserver|null} 생성된 옵저버 인스턴스 (필요시 해제 용도)
 */
export const initSwiperAutoplayObserver = (swiperInstance, targetElement, threshold = 0.2) => {
  if (!swiperInstance || !targetElement || typeof IntersectionObserver === 'undefined') return null;

  const swiperObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          swiperInstance.autoplay.start();
        } else {
          swiperInstance.autoplay.stop();
        }
      });
    },
    { threshold }
  );

  swiperObserver.observe(targetElement);
  return swiperObserver;
};

/**
 * Swiper 초기화 및 옵저버 바인딩을 한 번에 처리하는 팩토리 함수
 * @param {string|Element} selector - Swiper 컨테이너 선택자 또는 요소
 * @param {Object} options - Swiper 초기화 옵션
 * @param {boolean|Element} useAutoplayObserver - 화면 노출 시 자동재생 연동 여부. (true일 경우 selector 요소를 기준으로 적용. 별도 기준 요소가 필요하면 Element 전달)
 * @returns {Object|null} 생성된 Swiper 인스턴스
 */
export const createSwiper = (selector, options = {}, useAutoplayObserver = false) => {
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper 라이브러리가 로드되지 않았습니다.');
    return null;
  }

  // 요소 존재 여부 확인
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) return null;

  // 옵저버 사용 시, 최초 로드 시 불필요한 자동재생 방지를 위해 enabled: false 강제 (단, 옵션에 명시된 경우 제외)
  if (useAutoplayObserver && options.autoplay) {
    if (typeof options.autoplay === 'boolean') {
      options.autoplay = { enabled: false };
    } else if (options.autoplay.enabled === undefined) {
      options.autoplay.enabled = false;
    }
  }

  const instance = new Swiper(el, options);

  // 옵저버 연동
  if (useAutoplayObserver && options.autoplay) {
    const targetElement = useAutoplayObserver instanceof Element ? useAutoplayObserver : el;
    initSwiperAutoplayObserver(instance, targetElement);
  }

  return instance;
};
