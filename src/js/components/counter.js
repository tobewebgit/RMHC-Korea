/**
 * counter.js — 공통 카운트 애니메이션 모듈
 *
 * 사용처:
 *  - about/vision.html (.about-impact)
 *  - main/main.html (.main-impact)
 *
 * 사용법:
 *  import { initCounters } from '/src/js/components/counter.js';
 *  initCounters('.섹션-셀렉터', 'strong[data-counter-value]');
 *
 * data 속성:
 *  data-counter-value     : 목표 숫자 (필수)
 *  data-counter-suffix    : 접미어 (예: '+', 'K+', '억원+')
 *  data-counter-decimals  : 소수점 자리수 (기본 0)
 *  data-counter-comma     : "true" 이면 천 단위 콤마 삽입
 */
export function initCounters(sectionSelector, counterSelector) {
  const section = document.querySelector(sectionSelector);
  const counters = section
    ? Array.from(section.querySelectorAll(counterSelector))
    : [];

  if (!section || counters.length === 0) return;

  /* ── 포맷 헬퍼 ───────────────────────────────────────── */
  const formatValue = (el, value) => {
    const decimals = Number(el.dataset.counterDecimals || 0);
    const suffix   = el.dataset.counterSuffix || '';
    if (value <= 0) return `0${suffix}`;

    const rounded  = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
    const formatted =
      el.dataset.counterComma === 'true'
        ? Number(rounded).toLocaleString('en-US')
        : rounded;

    return `${formatted}${suffix}`;
  };

  /* ── 개별 애니메이션 ─────────────────────────────────── */
  const animate = (el) => {
    if (el.dataset.counterFrame) {
      cancelAnimationFrame(Number(el.dataset.counterFrame));
    }

    const target    = Number(el.dataset.counterValue || 0);
    const duration  = 2000; // ms
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = formatValue(el, target * eased);

      if (progress < 1) {
        el.dataset.counterFrame = requestAnimationFrame(tick);
      } else {
        el.textContent = formatValue(el, target);
        delete el.dataset.counterFrame;
      }
    };

    el.dataset.counterFrame = requestAnimationFrame(tick);
  };

  /* ── 초기화(0으로 리셋) ──────────────────────────────── */
  const reset = () => {
    counters.forEach((el) => {
      if (el.dataset.counterFrame) {
        cancelAnimationFrame(Number(el.dataset.counterFrame));
        delete el.dataset.counterFrame;
      }
      el.textContent = formatValue(el, 0);
    });
  };

  reset();

  /* ── IntersectionObserver ────────────────────────────── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counters.forEach(animate);
        } else {
          reset();
        }
      });
    },
    { threshold: 0.35 },
  );

  observer.observe(section);
}
