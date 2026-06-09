/**
 * 푸터 패밀리 사이트 드롭다운 제어 모듈
 */
export function initFamilySite() {
  const familySite = document.querySelector('.footer__family-site');
  if (!familySite) return;

  familySite.addEventListener('click', (e) => {
    // 링크 클릭은 별도 처리
    if (e.target.closest('.footer__family-site-list a')) return;
    
    const isOpen = familySite.getAttribute('aria-expanded') === 'true';
    familySite.setAttribute('aria-expanded', !isOpen);
  });

  // 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!familySite.contains(e.target)) {
      familySite.setAttribute('aria-expanded', 'false');
    }
  });
}
