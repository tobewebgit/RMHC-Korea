/**
 * 현재 URL 경로 분석 및 네비게이션 링크 active 상태 동적 매칭
 */
export function initNavigation() {
  const currentPath = window.location.pathname;
  const headerItems = document.querySelectorAll('.header__nav-item-wrap[data-gnb-menu]');
  const navLinks = document.querySelectorAll('.nav-link');

  headerItems.forEach(item => {
    const menuKey = item.dataset.gnbMenu;
    const link = item.querySelector('.header__nav-item');
    const href = link ? link.getAttribute('href') : '';
    const pathSegment = currentPath.split('/').filter(Boolean)[0] || 'main';
    const isActive =
      menuKey === pathSegment ||
      (href && href !== '/' && currentPath.endsWith(href));

    item.classList.toggle('is-active', isActive);
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');

    if (!href) return;

    // Root path matching
    if (currentPath === '/' && href === '/') {
      link.classList.add('active');
    } 
    // HTML page matching (e.g. /about.html or about.html)
    else if (href !== '/' && (currentPath.endsWith(href) || currentPath.includes(href))) {
      link.classList.add('active');
    }
  });
}
