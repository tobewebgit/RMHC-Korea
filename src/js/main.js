

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
  }  // --- 메인 홈 하우스 소개 섹션 인터랙션 ---
  const cascadeTriggers = document.querySelectorAll('.cascade-trigger');

  // 1) 중앙 이미지 및 일러스트 순차 등장 (Intersection Observer 1회성 Cascade)
  const cascadeOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const cascadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, cascadeOptions);

  cascadeTriggers.forEach(trigger => cascadeObserver.observe(trigger));

  // 2) 텍스트 리빌 (실시간 스크롤 진행도 비율 매핑)
  const handleTextScrollReveal = () => {
    const revealLines = document.querySelectorAll('.reveal-line');
    const viewHeight = window.innerHeight;

    revealLines.forEach(line => {
      const rect = line.getBoundingClientRect();
      
      // 뷰포트 기준 반응 시작/끝 경계 설정 (화면 밑 85% ~ 화면 위 25% 범위)
      const start = viewHeight * 0.85;
      const end = viewHeight * 0.25;

      // 스크롤 진행률 계산 (0 ~ 1)
      let progress = (start - rect.top) / (start - end);
      progress = Math.max(0, Math.min(1, progress));

      // [1] transform: 2.5rem -> 0rem 위로 안착
      const translateY = (1 - progress) * 2.5;
      line.style.transform = `translateY(${translateY}rem)`;

      // [2] opacity: 0.25 -> 1.0 페이드인
      const opacity = 0.25 + (progress * 0.75);
      line.style.opacity = opacity;

      // [3] color: 그레이 rgb(158,158,158) -> 차콜 rgb(31,41,55) 스무스 보간
      const r = Math.round(158 - progress * (158 - 31));
      const g = Math.round(158 - progress * (158 - 41));
      const b = Math.round(158 - progress * (158 - 55));
      line.style.color = `rgb(${r}, ${g}, ${b})`;

      // [4] inline-icon: grayscale(1) -> grayscale(0) 및 opacity 보간
      const icon = line.querySelector('.inline-icon');
      if (icon) {
        const grayscale = 1 - progress;
        icon.style.filter = `grayscale(${grayscale})`;
        icon.style.opacity = opacity;
      }

      // [5] reveal-highlight: 진행도가 70%가 넘었을 때 노란 밑줄 클래스 활성화
      if (progress >= 0.7) {
        line.classList.add('is-highlighted');
      } else {
        line.classList.remove('is-highlighted');
      }
    });
  };

  // 이벤트 등록 및 초기 실행
  window.addEventListener('scroll', handleTextScrollReveal);
  window.addEventListener('resize', handleTextScrollReveal);
  handleTextScrollReveal();

  console.log('RMHC Portal template initialized successfully.');
});
