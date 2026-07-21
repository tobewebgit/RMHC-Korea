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
    });
  });
}
