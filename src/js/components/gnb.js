/**
 * 모바일 GNB 및 아코디언 메뉴 제어 모듈
 */
export function initMobileGnb() {
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileMenuPanel = document.querySelector('.mobile-menu-panel');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mGnbTriggers = document.querySelectorAll('.m-gnb-trigger');

  // 요소가 하나도 없으면 초기화 건너뜀
  if (!mobileNavToggle && !mobileMenuPanel && mGnbTriggers.length === 0) return;

  // 모바일 메뉴 열기/닫기 함수
  const toggleMobileMenu = (isOpen) => {
    if (!mobileMenuPanel) return;
    
    const shouldOpen = typeof isOpen === 'boolean' 
      ? isOpen 
      : !mobileMenuPanel.classList.contains('active');
    
    if (shouldOpen) {
      mobileMenuPanel.classList.add('active');
      if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
      if (mobileNavToggle) {
        mobileNavToggle.classList.add('active');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
      }
      document.body.classList.add('menu-open');
      mobileMenuPanel.setAttribute('aria-hidden', 'false');
    } else {
      mobileMenuPanel.classList.remove('active');
      if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
      if (mobileNavToggle) {
        mobileNavToggle.classList.remove('active');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      }
      document.body.classList.remove('menu-open');
      mobileMenuPanel.setAttribute('aria-hidden', 'true');
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
      const parentNode = parentLi.parentNode;
      if (parentNode) {
        const allSiblings = parentNode.querySelectorAll('.m-gnb-item');
        allSiblings.forEach(sibling => {
          if (sibling !== parentLi) {
            sibling.classList.remove('active');
          }
        });
      }

      // 현재 메뉴 토글
      if (isActive) {
        parentLi.classList.remove('active');
      } else {
        parentLi.classList.add('active');
      }
    });
  });
}
