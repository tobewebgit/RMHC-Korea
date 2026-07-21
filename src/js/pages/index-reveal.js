/**
 * 메인 홈 하우스 소개 섹션 인터랙션 모듈 (Scroll Reveal / Lerp / SplitText)
 */
export function initIndexReveal() {
  const cascadeTriggers = document.querySelectorAll('.cascade-trigger');
  const revealTrigger = document.querySelector('.reveal-trigger');
  if (cascadeTriggers.length === 0 && !revealTrigger) return;

  // 1) 중앙 이미지 및 일러스트 순차 등장 (Intersection Observer 1회성 Cascade)
  const cascadeOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const syncImage = document.querySelector('.main-house__sync-img');
  const syncLabel = document.querySelector('.main-house__label');
  let syncTimeline = null;

  if (syncImage && typeof gsap !== 'undefined') {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      syncTimeline = gsap.timeline({ paused: true });
      
      // 1. 이미지 스케일 업
      syncTimeline.to(syncImage, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power2.out'
      });
      
      // 2. 이미지가 커진 후 라벨 노출
      if (syncLabel) {
        syncTimeline.to(syncLabel, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.5)'
        }, "-=0.5"); // 이미지 애니메이션 끝나기 0.5초 전에 서서히 나타나기 시작
      }
    }
  }

  const cascadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, cascadeOptions);

  cascadeTriggers.forEach(trigger => cascadeObserver.observe(trigger));

  // 2) 텍스트 노드 자동 글자 단위(char) 및 단어 단위(word) 쪼개기 함수 (SplitText 바닐라 JS 구현)
  const splitTextIntoChars = () => {
    const revealLines = document.querySelectorAll('.reveal-line');
    
    revealLines.forEach(line => {
      const childNodes = Array.from(line.childNodes);
      line.innerHTML = ''; // 기존 내용 청소
      
      const processTextNode = (textNode, container) => {
        const text = textNode.textContent;
        // 연속된 공백 및 단어 구분 (공백 캡처 그룹 포함)
        const tokens = text.split(/(\s+)/);
        
        tokens.forEach(token => {
          if (!token) return;
          
          if (/^\s+$/.test(token)) {
            // 공백 문자열인 경우 그대로 텍스트 노드로 삽입
            container.appendChild(document.createTextNode(token));
          } else {
            // 일반 단어인 경우 단어 래퍼 생성 후 각 글자를 reveal-char로 쪼개어 삽입
            const wordSpan = document.createElement('span');
            wordSpan.className = 'reveal-word';
            
            for (let char of token) {
              const charSpan = document.createElement('span');
              charSpan.className = 'reveal-char';
              charSpan.textContent = char;
              wordSpan.appendChild(charSpan);
            }
            container.appendChild(wordSpan);
          }
        });
      };

      childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          processTextNode(node, line);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList.contains('reveal-highlight')) {
            // 하이라이트 스팬 내부의 텍스트 노드 분할
            const highlightNodes = Array.from(node.childNodes);
            node.innerHTML = '';
            
            highlightNodes.forEach(hNode => {
              if (hNode.nodeType === Node.TEXT_NODE) {
                processTextNode(hNode, node);
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
  const lerpFactor = 0.15; // 스크롤 관성(바운싱)을 줄이기 위해 추종 계수를 0.15로 상향 조정

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

      const sequenceItems = line.querySelectorAll('.reveal-char, .inline-icon');
      const totalItems = sequenceItems.length;

      // 줄 내부의 글자와 아이콘들은 해당 줄의 lineProgress 내에서 완전 순차(오버랩 없음) 전개
      sequenceItems.forEach((item, index) => {
        const itemInterval = 1.0 / totalItems;
        // 각 요소가 움직이는 시간은 인터벌의 55%로 축소하여 텀 확보
        const itemDuration = itemInterval * 0.55; 
        const itemStart = index * itemInterval;

        let itemProgress = (lineProgress - itemStart) / itemDuration;
        itemProgress = Math.max(0, Math.min(1, itemProgress));

        if (item.classList.contains('inline-icon')) {
          // 아이콘: 텍스트가 벌어지면서 나타나도록 너비와 마진을 0에서부터 증가시킴
          item.style.opacity = itemProgress;
          
          // data-width 속성이 있으면 해당 값을 rem으로 환산하여 적용, 없으면 기본값 6rem
          const dataWidth = parseFloat(item.dataset.width);
          const targetWidth = isNaN(dataWidth) ? 6 : (dataWidth / 10);
          const targetMargin = 0;
          
          item.style.width = `${itemProgress * targetWidth}rem`;
          item.style.marginLeft = `${itemProgress * targetMargin}rem`;
          item.style.marginRight = `${itemProgress * targetMargin}rem`;
          
          // 0.6 스케일에서 1로 커지는 효과
          const scale = 0.6 + (itemProgress * 0.4);
          item.style.transform = `scale(${scale}) translateY(-0.6rem)`;
          item.style.filter = 'none';
          
          // 이미지가 공간 내에서 비율을 유지하며 잘리지 않도록 (너비 0일 때 깨짐 방지)
          item.style.objectFit = 'contain';
        } else {
          // 글자(reveal-char): 기존 로직 동일 (위로 0.5rem 안착, 회색 -> 검은색)
          // const translateY = (1 - itemProgress) * 0.5;
          const translateY = 0;
          item.style.transform = `translateY(${translateY}rem)`;

          const r = Math.round(170 - itemProgress * 170);
          const g = Math.round(170 - itemProgress * 170);
          const b = Math.round(170 - itemProgress * 170);
          item.style.color = `rgb(${r}, ${g}, ${b})`;

          // reveal-highlight 밑줄 클래스 제어
          if (item.closest('.reveal-highlight')) {
            if (itemProgress >= 0.95) {
              line.classList.add('is-highlighted');
            } else {
              line.classList.remove('is-highlighted');
            }
          }
        }
      });
    });

    if (syncTimeline) {
      if (progress >= 0.99) {
        syncTimeline.play();
      } else {
        syncTimeline.reverse();
      }
    }
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
    if (!revealTrigger) return;

    // 페이지 전체 스크롤이 최상단(0) 근처일 때는 진행률을 강제로 0으로 고정하여 첫 글자조차 켜지지 않도록 함
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    let progress = 0;
    
    if (scrollY > 5) {
      const rect = revealTrigger.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const start = viewHeight * 0.90;
      const end = viewHeight * 0.10; // 종료 지점을 화면 상단 10% 지점으로 설정하여 유효 범위를 약 80% 수준으로 정밀 감속 조율

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
  
  const handleResize = () => {
    if (!revealTrigger) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    let progress = 0;
    
    if (scrollY > 5) {
      const rect = revealTrigger.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const start = viewHeight * 0.90;
      const end = viewHeight * 0.10;
      progress = (start - rect.top) / (start - end);
      progress = Math.max(0, Math.min(1, progress));
    }
    
    targetProgress = progress;
    currentProgress = progress;
    updateTextReveal(progress);
  };
  window.addEventListener('resize', handleResize);

  // 초기 1회 즉시 실행
  const initTextReveal = () => {
    if (!revealTrigger) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    let progress = 0;
    
    if (scrollY > 5) {
      const rect = revealTrigger.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const start = viewHeight * 0.90;
      const end = viewHeight * 0.10;
      progress = (start - rect.top) / (start - end);
      progress = Math.max(0, Math.min(1, progress));
    }
    
    targetProgress = progress;
    currentProgress = progress;
    updateTextReveal(progress);
  };
  initTextReveal();
}

// 모듈 로드 시 자동 초기화 수행
initIndexReveal();

