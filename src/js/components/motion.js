/**
 * RMHC Korea 공통 스크롤 모션 모듈
 * GSAP 라이브러리를 활용하여 요소가 화면에 보일 때 부드러운 페이드인 애니메이션을 적용합니다.
 */

export const initScrollMotions = () => {
  // 1. prefers-reduced-motion 미디어 쿼리 감지 (애니메이션 최소화/해제 설정 체크)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // GSAP 로드 여부 검사 및 접근성 설정 체크
  if (typeof gsap === 'undefined') {
    console.warn('GSAP library is not loaded. Scroll motions will not be initialized.');
    return;
  }

  // 2. data-motion 속성을 가진 모든 요소 탐색
  const motionElements = document.querySelectorAll('[data-motion]');
  if (motionElements.length === 0) return;

  motionElements.forEach((el) => {
    const motionType = el.dataset.motion; // 'fade-up' 등 확장 대비
    const duration = parseFloat(el.dataset.motionDuration) || 0.8;
    const delay = parseFloat(el.dataset.motionDelay) || 0;
    const offset = parseFloat(el.dataset.motionOffset) || 40;
    const once = el.dataset.motionOnce === 'true'; // 기본값 false (화면 이탈 시 반복 동작)
    const initialScale = el.dataset.motionScale ? parseFloat(el.dataset.motionScale) : null;

    // prefers-reduced-motion이 켜져 있는 경우, 모션 효과 없이 즉시 표시되도록 설정
    if (reduceMotion) {
      gsap.set(el, { opacity: 1, y: 0, ...(initialScale !== null && { scale: 1 }) });
      return;
    }

    // 3. 초기 스타일 설정 (초기 페이드 아웃 및 위치 조정)
    if (motionType === 'fade-up') {
      gsap.set(el, {
        opacity: 0,
        y: offset,
        ...(initialScale !== null && { scale: initialScale }),
      });
    }

    // 4. IntersectionObserver를 이용한 트리거 바인딩 (ScrollTrigger 없이 가볍게 동작)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 화면에 15% 이상 노출되었을 때 모션 트윈 실행
            gsap.to(el, {
              opacity: 1,
              y: 0,
              ...(initialScale !== null && { scale: 1 }),
              duration: duration,
              delay: delay,
              ease: 'power2.out',
              overwrite: 'auto',
            });
            // 한 번만 실행하는 옵션(once: true)일 경우 감지 해제
            if (once) {
              observer.unobserve(el);
            }
          } else {
            // 화면 밖으로 나갔고, 반복 모션 옵션(once: false)일 경우
            if (!once) {
              const rect = entry.boundingClientRect;
              const root = entry.rootBounds;
              
              // threshold(0.15) 환경에서 이탈 감지 시점의 오차를 보정하기 위해 요소와 뷰포트의 Y축 중심점 비교
              const elementCenterY = rect.top + rect.height / 2;
              const viewportHeight = root ? root.height : window.innerHeight;
              const viewportTop = root ? root.top : 0;
              const viewportCenterY = viewportTop + viewportHeight / 2;
              
              const isBelowViewport = elementCenterY > viewportCenterY;

              if (isBelowViewport) {
                gsap.killTweensOf(el);
                if (motionType === 'fade-up') {
                  gsap.set(el, {
                    opacity: 0,
                    y: offset,
                    ...(initialScale !== null && { scale: initialScale }),
                  });
                }
              }
            }
          }
        });
      },
      {
        root: null, // 뷰포트 기준
        threshold: 0.15, // 15% 정도 감지 영역 진입 시
      }
    );

    observer.observe(el);
  });
};
