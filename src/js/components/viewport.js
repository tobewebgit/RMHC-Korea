/**
 * 모바일 가로모드 viewport 제어
 *
 * 모바일 가로모드에서 CSS viewport가 너무 좁게 계산되는 단말은
 * 페이지 콘텐츠를 PC breakpoint로 렌더링하고, 헤더는 별도 landscape
 * 모바일 스타일을 사용하도록 viewport를 전환한다.
 */
const DEFAULT_VIEWPORT = 'width=device-width, initial-scale=1.0';
const LANDSCAPE_VIEWPORT = 'width=769';
const LANDSCAPE_MIN_WIDTH = 600;

const isMobileDevice = () => {
  const userAgent = navigator.userAgent || '';

  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Samsung/i.test(
      userAgent,
    ) ||
    ('ontouchstart' in window && (navigator.maxTouchPoints || 0) > 0)
  );
};

const getViewportMeta = () => {
  let meta = document.querySelector('meta[name="viewport"]');

  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'viewport';
    document.head.prepend(meta);
  }

  return meta;
};

export const initViewportControl = () => {
  const meta = getViewportMeta();
  let updateTimer = null;

  const updateViewport = () => {
    const isLandscape = window.innerWidth > window.innerHeight;
    const isMobileLandscape =
      isMobileDevice() &&
      isLandscape &&
      window.innerWidth >= LANDSCAPE_MIN_WIDTH;
    const nextViewport = isMobileLandscape
      ? LANDSCAPE_VIEWPORT
      : DEFAULT_VIEWPORT;

    document.documentElement.classList.toggle(
      'is-mobile-landscape',
      isMobileLandscape,
    );

    if (meta.getAttribute('content') === nextViewport) return;
    meta.setAttribute('content', nextViewport);
  };

  const scheduleUpdate = () => {
    window.clearTimeout(updateTimer);
    updateTimer = window.setTimeout(updateViewport, 150);
  };

  updateViewport();
  window.addEventListener('orientationchange', scheduleUpdate, {
    passive: true,
  });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
};
