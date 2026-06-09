

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

  // 2) 텍스트 노드 자동 글자 단위(char) 쪼개기 함수 (SplitText 바닐라 JS 구현)
  const splitTextIntoChars = () => {
    const revealLines = document.querySelectorAll('.reveal-line');
    
    revealLines.forEach(line => {
      const childNodes = Array.from(line.childNodes);
      line.innerHTML = ''; // 기존 내용 청소
      
      childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          // 일반 텍스트 노드 분할
          const text = node.textContent;
          const fragment = document.createDocumentFragment();
          
          for (let char of text) {
            if (char === ' ' || char === '\n' || char === '\t') {
              fragment.appendChild(document.createTextNode(char));
            } else {
              const span = document.createElement('span');
              span.className = 'reveal-char';
              span.textContent = char;
              fragment.appendChild(span);
            }
          }
          line.appendChild(fragment);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList.contains('reveal-highlight')) {
            // 하이라이트 스팬 내부의 텍스트 노드 분할
            const highlightNodes = Array.from(node.childNodes);
            node.innerHTML = '';
            
            highlightNodes.forEach(hNode => {
              if (hNode.nodeType === Node.TEXT_NODE) {
                const text = hNode.textContent;
                const fragment = document.createDocumentFragment();
                for (let char of text) {
                  if (char === ' ' || char === '\n' || char === '\t') {
                    fragment.appendChild(document.createTextNode(char));
                  } else {
                    const span = document.createElement('span');
                    span.className = 'reveal-char';
                    span.textContent = char;
                    fragment.appendChild(span);
                  }
                }
                node.appendChild(fragment);
              } else {
                node.appendChild(hNode);
              }
            });
            line.appendChild(node);
          } else {
            // 이미지 등 기타 엘리먼트는 그대로 보존
            line.appendChild(node);
          }
        }
      });
    });
  };

  // 초기 1회 글자 분할 실행
  splitTextIntoChars();

  // 3) 글자별 실시간 스크롤 리빌 (실시간 스크롤 진행도 + Stagger 시차 매핑)
  const handleTextScrollReveal = () => {
    const revealTrigger = document.querySelector('.reveal-trigger');
    if (!revealTrigger) return;

    const rect = revealTrigger.getBoundingClientRect();
    const viewHeight = window.innerHeight;

    // 텍스트 영역 전체 기준 반응 경계선 설정 (화면 밑 90% ~ 화면 위 20%)
    const start = viewHeight * 0.9;
    const end = viewHeight * 0.2;

    // 전체 텍스트 진행도 계산 (0 ~ 1)
    let progress = (start - rect.top) / (start - end);
    progress = Math.max(0, Math.min(1, progress));

    const chars = document.querySelectorAll('.reveal-char');
    const icons = document.querySelectorAll('.reveal-line .inline-icon');

    // 각 개별 문자(char)별로 순차적 stagger 시차를 적용하여 속성 매핑
    chars.forEach((char, index) => {
      // 글자별 활성화 지연 비율 (0.0 ~ 0.7 구간에 골고루 분배)
      const charDelay = index / chars.length;
      // 각 글자별 진행률 계산 (가속 계수 4배 적용)
      let charProgress = (progress - charDelay * 0.7) * 4;
      charProgress = Math.max(0, Math.min(1, charProgress));

      // [1] transform: 2rem -> 0rem 위로 안착
      const translateY = (1 - charProgress) * 2;
      char.style.transform = `translateY(${translateY}rem)`;

      // [2] opacity: 0.25 -> 1.0 페이드인
      const opacity = 0.25 + (charProgress * 0.75);
      char.style.opacity = opacity;

      // [3] color: 그레이 rgb(158,158,158) -> 차콜 rgb(31,41,55) 스무스 보간
      const r = Math.round(158 - charProgress * (158 - 31));
      const g = Math.round(158 - charProgress * (158 - 41));
      const b = Math.round(158 - charProgress * (158 - 55));
      char.style.color = `rgb(${r}, ${g}, ${b})`;

      // reveal-highlight 클래스 추가 여부 결정
      const parentLine = char.closest('.reveal-line');
      if (parentLine && char.closest('.reveal-highlight')) {
        if (charProgress >= 0.7) {
          parentLine.classList.add('is-highlighted');
        } else {
          parentLine.classList.remove('is-highlighted');
        }
      }
    });

    // 인라인 아이콘(icon) 스크롤 시차 처리
    icons.forEach((icon, index) => {
      const iconDelay = index / (icons.length + 1);
      let iconProgress = (progress - iconDelay * 0.7) * 4;
      iconProgress = Math.max(0, Math.min(1, iconProgress));

      icon.style.opacity = 0.25 + (iconProgress * 0.75);
      icon.style.filter = `grayscale(${1 - iconProgress})`;
    });
  };

  // 이벤트 등록 및 초기 실행
  window.addEventListener('scroll', handleTextScrollReveal);
  window.addEventListener('resize', handleTextScrollReveal);
  handleTextScrollReveal();

  console.log('RMHC Portal template initialized successfully.');
});
