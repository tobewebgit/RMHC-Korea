

document.addEventListener('DOMContentLoaded', () => {
  // 현재 URL 경로 분석 및 네비게이션 링크 active 상태 동적 매칭
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');

    // Root path matching
    if (currentPath === '/' && href === '/') {
      link.classList.add('active');
    } 
    // HTML page matching (e.g. /about.html or about.html)
    else if (href !== '/' && (currentPath.endsWith(href) || currentPath.includes(href))) {
      link.classList.add('active');
    }
  });

  // --- 모바일 GNB 인터랙션 추가 ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileMenuPanel = document.querySelector('.mobile-menu-panel');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mGnbTriggers = document.querySelectorAll('.m-gnb-trigger');

  // 모바일 메뉴 열기/닫기 함수
  const toggleMobileMenu = (isOpen) => {
    const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !mobileMenuPanel.classList.contains('active');
    
    if (shouldOpen) {
      if (mobileMenuPanel) mobileMenuPanel.classList.add('active');
      if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
      if (mobileNavToggle) mobileNavToggle.classList.add('active');
      document.body.classList.add('menu-open');
      if (mobileMenuPanel) mobileMenuPanel.setAttribute('aria-hidden', 'false');
      if (mobileNavToggle) mobileNavToggle.setAttribute('aria-expanded', 'true');
    } else {
      if (mobileMenuPanel) mobileMenuPanel.classList.remove('active');
      if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
      if (mobileNavToggle) mobileNavToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
      if (mobileMenuPanel) mobileMenuPanel.setAttribute('aria-hidden', 'true');
      if (mobileNavToggle) mobileNavToggle.setAttribute('aria-expanded', 'false');
    }
  };

  // 이벤트 리스너 바인딩
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => toggleMobileMenu());
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => toggleMobileMenu(false));
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', () => toggleMobileMenu(false));
  }

  // 모바일 2Depth 아코디언 메뉴 제어
  mGnbTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const parentLi = e.currentTarget.closest('.m-gnb-item');
      if (!parentLi) return;

      const isActive = parentLi.classList.contains('active');
      
      // 다른 열려있는 메뉴 닫기 (아코디언 동작)
      const allSiblings = parentLi.parentNode.querySelectorAll('.m-gnb-item');
      allSiblings.forEach(sibling => {
        if (sibling !== parentLi) {
          sibling.classList.remove('active');
        }
      });

      // 현재 메뉴 토글
      if (isActive) {
        parentLi.classList.remove('active');
      } else {
        parentLi.classList.add('active');
      }
    });
  });

  // --- Footer: Family site 커스텀 셀렉트 ---
  const familySite = document.querySelector('.footer__family-site');
  if (familySite) {
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




  console.log('RMHC Portal template initialized successfully.');
});
