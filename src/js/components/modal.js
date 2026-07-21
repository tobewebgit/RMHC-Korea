/**
 * RMHC Portal - 글로벌 공통 모달 시스템 스크립트 (src/js/components/modal.js)
 */

// 모달 열기 공통 함수
export function openModal(target) {
  const modal = typeof target === 'string' ? document.querySelector(target) : target;
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
  }
}

// 모달 닫기 공통 함수
export function closeModal(target) {
  const modal = typeof target === 'string' ? document.querySelector(target) : target;
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // 스크롤 원복

    // 커스텀 이벤트 발행 (뉴스레터 폼 리셋 등 화면별 개별 정리 콜백용)
    const event = new CustomEvent('modalclose');
    modal.dispatchEvent(event);
  }
}

// 글로벌 공통 모달 초기화
export function initModal() {
  // 1. 전역 모달 열기 핸들러 (.btn-open-popup 대응)
  document.addEventListener('click', (e) => {
    const openTrigger = e.target.closest('.btn-open-popup');
    if (openTrigger) {
      e.preventDefault();
      const targetId = openTrigger.getAttribute('data-popup');
      if (targetId) {
        // ID Selector 포맷 보정
        const cleanId = targetId.startsWith('#') ? targetId : `#${targetId}`;
        openModal(cleanId);
      }
    }
  });

  // 2. 전역 모달 닫기 핸들러 (취소, 닫기 및 공통 원형 닫기 단추 매핑)
  document.addEventListener('click', (e) => {
    const closeTrigger = e.target.closest('.modal-close, .btn-popup-cancel, .modal-close-btn-circle, [data-modal-close]');
    if (closeTrigger) {
      e.preventDefault();
      const modal = closeTrigger.closest('.modal-overlay');
      if (modal) {
        closeModal(modal);
      }
    }
  });

  // 3. 딤드(오버레이) 영역 클릭 시 모달 닫기
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      // 메인 팝업은 오버레이 클릭으로 닫히지 않도록 예외 처리
      if (e.target.classList.contains('modal-overlay--main') || e.target.hasAttribute('data-disable-overlay-close')) {
        return;
      }
      closeModal(e.target);
    }
  });
}
