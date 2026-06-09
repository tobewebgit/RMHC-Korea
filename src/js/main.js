

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

  // 3) 줄별 순차 전개(Timeline Sequence) 및 글자 간 정지 텀(Pause Gap) 기반 실시간 스크롤 리빌
  let targetProgress = 0;
  let currentProgress = 0;
  let rafId = null;
  const lerpFactor = 0.05; // 스크롤을 묵직하고 천천히 추종하도록 세팅

  const updateTextReveal = (progress) => {
    const revealLines = document.querySelectorAll('.reveal-line');
    const N = revealLines.length; // 총 줄 개수 (4줄)
    const viewHeight = window.innerHeight;

    revealLines.forEach((line, lineIndex) => {
      // 각 줄이 독립적으로 반응할 전체 타임라인 내 스크롤 구간 설정
      const startRange = lineIndex / N;
      const endRange = (lineIndex + 1) / N;

      // 전체 진행도가 해당 줄의 시작 경계에 진입했을 때부터 개별 진행률 작동
      let lineProgress = (progress - startRange) / (endRange - startRange);
      lineProgress = Math.max(0, Math.min(1, lineProgress));

      const lineChars = line.querySelectorAll('.reveal-char');
      const totalChars = lineChars.length;

      // 줄 내부의 글자들은 해당 줄의 lineProgress 내에서 완전 순차(오버랩 없음) 전개
      lineChars.forEach((char, index) => {
        const charInterval = 1.0 / totalChars;
        // 각 글자가 움직이는 시간은 인터벌의 55%로 축소하여, 나머지 45%를 이전 글자 완료 후 다음 글자 시작 전의 정적 대기 시간(텀)으로 확보
        const charDuration = charInterval * 0.55; 
        const charStart = index * charInterval;

        let charProgress = (lineProgress - charStart) / charDuration;
        charProgress = Math.max(0, Math.min(1, charProgress));

        // 1) transform: 0.5rem -> 0rem 위로 안착
        const translateY = (1 - charProgress) * 0.5;
        char.style.transform = `translateY(${translateY}rem)`;

        // 2) color: 연한 그레이 rgb(200,200,200) -> 완전 블랙 rgb(0,0,0) (피그마 기준)
        const r = Math.round(200 - charProgress * 200);
        const g = Math.round(200 - charProgress * 200);
        const b = Math.round(200 - charProgress * 200);
        char.style.color = `rgb(${r}, ${g}, ${b})`;

        // reveal-highlight 밑줄 클래스 제어
        if (char.closest('.reveal-highlight')) {
          if (charProgress >= 0.95) {
            line.classList.add('is-highlighted');
          } else {
            line.classList.remove('is-highlighted');
          }
        }
      });
    });

    // 인라인 아이콘 개별 스크롤 연동 (전체 progress 비례)
    const icons = document.querySelectorAll('.reveal-line .inline-icon');
    icons.forEach((icon, index) => {
      const rect = icon.getBoundingClientRect();
      const start = viewHeight * 0.90;
      const end = viewHeight * 0.25;

      let iconProgress = (start - rect.top) / (start - end);
      iconProgress = Math.max(0, Math.min(1, iconProgress));

      const translateY = (1 - iconProgress) * 0.5;
      icon.style.transform = `translateY(${translateY - 0.2}rem)`;
      icon.style.filter = `grayscale(${1 - iconProgress})`;
    });
  };

  const tick = () => {
    // Lerp 연산 적용
    currentProgress += (targetProgress - currentProgress) * lerpFactor;
    
    // 차이가 극히 적어지면 근사치 대입 후 애니메이션 종료
    if (Math.abs(targetProgress - currentProgress) < 0.0001) {
      currentProgress = targetProgress;
      updateTextReveal(currentProgress);
      rafId = null;
    } else {
      updateTextReveal(currentProgress);
      rafId = requestAnimationFrame(tick);
    }
  };

  const handleTextScrollReveal = () => {
    const revealTrigger = document.querySelector('.reveal-trigger');
    if (!revealTrigger) return;

    // 페이지 전체 스크롤이 최상단(0) 근처일 때는 진행률을 강제로 0으로 고정하여 첫 글자조차 켜지지 않도록 함
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    let progress = 0;
    
    if (scrollY > 5) {
      const rect = revealTrigger.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const start = viewHeight * 0.90;
      const end = viewHeight * 0.25;

      progress = (start - rect.top) / (start - end);
      progress = Math.max(0, Math.min(1, progress));
    }

    targetProgress = progress;

    if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  };

  // 스크롤 및 브라우저 크기 변경 시 이벤트 등록
  window.addEventListener('scroll', handleTextScrollReveal);
  window.addEventListener('resize', () => {
    // 리사이즈 시에도 스크롤 값 기준으로 즉시 상태 업데이트
    const revealTrigger = document.querySelector('.reveal-trigger');
    if (revealTrigger) {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      let progress = 0;
      
      if (scrollY > 5) {
        const rect = revealTrigger.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const start = viewHeight * 0.90;
        const end = viewHeight * 0.25;
        progress = (start - rect.top) / (start - end);
        progress = Math.max(0, Math.min(1, progress));
      }
      
      targetProgress = progress;
      currentProgress = progress;
      updateTextReveal(progress);
    }
  });

  // 초기 1회 즉시 실행
  const initTextReveal = () => {
    const revealTrigger = document.querySelector('.reveal-trigger');
    if (revealTrigger) {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      let progress = 0;
      
      if (scrollY > 5) {
        const rect = revealTrigger.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const start = viewHeight * 0.90;
        const end = viewHeight * 0.25;
        progress = (start - rect.top) / (start - end);
        progress = Math.max(0, Math.min(1, progress));
      }
      
      targetProgress = progress;
      currentProgress = progress;
      updateTextReveal(progress);
    }
  };
  initTextReveal();

  console.log('RMHC Portal template initialized successfully.');
});
