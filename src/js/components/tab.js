/**
 * RMHC Korea 공통 탭 인터랙션 모듈 (tab.js)
 * 
 * data-tab-target 속성을 가진 탭 버튼과 이에 매칭되는 탭 콘텐츠를 동적으로 제어합니다.
 * 중첩된 탭 구조에서도 상호 간섭 없이 격리되어 동작합니다.
 */
export function initTabs() {
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-tab-target');
      const targetContent = document.getElementById(targetId);
      if (!targetContent) return;
      
      // 1. 같은 그룹 내의 버튼 활성화 처리 (active 클래스 제어)
      const groupName = this.getAttribute('data-tab-group');
      let siblingButtons = [];
      
      if (groupName) {
        siblingButtons = document.querySelectorAll(`[data-tab-group="${groupName}"]`);
      } else {
        const parentMenu = this.closest('.tab-menu, .sub-tab-menu, .payment-tabs-grid, .tab-list, .sub-tab-list, .faq-tab-menu');
        if (parentMenu) {
          siblingButtons = parentMenu.querySelectorAll('[data-tab-target]');
        } else {
          siblingButtons = this.parentElement.querySelectorAll('[data-tab-target]');
        }
      }
      siblingButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.classList.contains('btn-primary')) {
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-outline');
        }
      });
      this.classList.add('active');
      if (this.classList.contains('btn-outline')) {
        this.classList.remove('btn-outline');
        this.classList.add('btn-primary');
      }
      
      // 2. 정확한 탭 계층에 맞춰 콘텐츠 영역 display 제어 (클래스 매칭 검증)
      const contentClasses = ['tab-content', 'sub-tab-content', 'payment-tab-content', 'faq-tab-content'];
      let matchedClass = '';
      
      for (const cls of contentClasses) {
        if (targetContent.classList.contains(cls)) {
          matchedClass = cls;
          break;
        }
      }
      
      if (matchedClass) {
        // 정확히 매치되는 클래스 유형을 가진 형제 콘텐츠들만 골라서 비활성화
        const siblingContents = targetContent.parentElement.querySelectorAll(`.${matchedClass}`);
        siblingContents.forEach(content => {
          content.classList.remove('active');
          content.style.display = 'none';
        });
      } else {
        // 매칭되는 특수 클래스가 없으면 자식 요소들을 순회하며 숨김 처리
        const siblings = targetContent.parentElement.children;
        for (const sibling of siblings) {
          if (sibling !== targetContent) {
            sibling.classList.remove('active');
            sibling.style.display = 'none';
          }
        }
      }
      
      // 현재 콘텐츠만 활성화
      targetContent.classList.add('active');
      targetContent.style.display = 'block';

      // 3. 모바일 가로 스크롤 탭 메뉴: 활성화된 탭을 중앙으로 부드럽고 느리게 스크롤
      const activeItem = this.closest('.tab-item') || this;
      let scrollContainer = this.closest('.tab-list, .sub-tab-list, .tab-menu, .sub-tab-menu, .faq-tab-menu');
      
      while (scrollContainer && scrollContainer !== document.body) {
        if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
          const targetScrollLeft = activeItem.offsetLeft - (scrollContainer.clientWidth / 2) + (activeItem.clientWidth / 2);
          smoothScrollTo(scrollContainer, Math.max(0, targetScrollLeft), 500);
          break;
        }
        scrollContainer = scrollContainer.parentElement ? scrollContainer.parentElement.closest('.tab-list, .sub-tab-list, .tab-menu, .sub-tab-menu, .faq-tab-menu') : null;
      }
    });
  });
}

/**
 * 부드럽고 우아한 감속 커스텀 스크롤 애니메이션 함수
 * @param {HTMLElement} element - 스크롤할 컨테이너
 * @param {number} target - 목표 scrollLeft 위치
 * @param {number} duration - 애니메이션 지속 시간 (ms, 기본 500ms)
 */
function smoothScrollTo(element, target, duration = 500) {
  const start = element.scrollLeft;
  const change = target - start;
  if (Math.abs(change) < 1) return;

  const startTime = performance.now();

  // 감속이 부드러운 easeOutCubic 이징 커브
  function easeOutCubic(t) {
    return (--t) * t * t + 1;
  }

  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeOutCubic(progress);

    element.scrollLeft = start + change * easeProgress;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}
