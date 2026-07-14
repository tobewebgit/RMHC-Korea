/**
 * RMHC Portal - Newsletter Subscription Modal Interaction (js/components/newsletter.js)
 */
import { openModal, closeModal } from './modal.js';

export function initNewsletter() {
  const footerEmailInput = document.getElementById('input-footer-email');
  const footerSubmitBtn = document.getElementById('btn-footer-newsletter');
  
  const modal = document.getElementById('modal-newsletter');
  const modalContainer = document.getElementById('newsletter-modal-container');
  const modalCloseBtn = document.getElementById('btn-newsletter-close');
  const agreementChk = document.getElementById('chk-newsletter-agreement');
  const submitBtn = document.getElementById('btn-newsletter-submit');
  const confirmBtn = document.getElementById('btn-newsletter-confirm');
  
  const step1 = document.getElementById('newsletter-step-1');
  const step2 = document.getElementById('newsletter-step-2');

  if (!footerEmailInput || !footerSubmitBtn || !modal || !modalContainer) {
    return;
  }

  // 1차 이메일 유효성 검사 함수
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  }

  // 모달 내부 상태 초기화 함수
  function resetModalState() {
    if (agreementChk) agreementChk.checked = false;
    if (submitBtn) submitBtn.disabled = true;
    
    // step 1 활성화, step 2 비활성화
    if (step1) step1.classList.add('active');
    if (step2) step2.classList.remove('active');

    // 높이 제어 클래스: Step 1 활성화
    modalContainer.classList.add('step-1-active');
    modalContainer.classList.remove('step-2-active');
  }

  // 공통 모달 닫기 시 뉴스레터 폼 상태 리셋 연동 콜백
  modal.addEventListener('modalclose', () => {
    footerEmailInput.value = '';
    resetModalState();
  });

  // 1. 푸터 '소식받기' 버튼 클릭 시 이벤트
  footerSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const emailVal = footerEmailInput.value;

    if (!emailVal.trim()) {
      window.showAlert({ type: 'alert', message: '이메일 주소를 입력해주세요.' });
      footerEmailInput.focus();
      return;
    }

    if (!validateEmail(emailVal)) {
      window.showAlert({ type: 'alert', message: '올바른 이메일 주소 형식을 입력해주세요.' });
      footerEmailInput.focus();
      return;
    }

    // 이메일 검증 성공 시 모달 오픈
    openModal(modal);
    resetModalState();
  });

  // 엔터 키 입력 시에도 작동하도록 처리
  footerEmailInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      footerSubmitBtn.click();
    }
  });

  // 2. [필수] 체크박스 변경 이벤트 -> 구독 완료하기 활성화 제어
  if (agreementChk && submitBtn) {
    agreementChk.addEventListener('change', () => {
      submitBtn.disabled = !agreementChk.checked;
    });
  }

  // 3. '구독 완료하기' 클릭 시 -> 완료(Step 2) 화면 전환
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!agreementChk || !agreementChk.checked) return;
      
      // Step 1 감추고 Step 2 표시
      if (step1) step1.classList.remove('active');
      if (step2) step2.classList.add('active');

      // 높이 제어 클래스: Step 2 완료 화면 높이로 스위칭
      modalContainer.classList.remove('step-1-active');
      modalContainer.classList.add('step-2-active');
    });
  }

  // 4. 완료 화면에서 '확인' 버튼 클릭 시 모달 닫기
  if (confirmBtn) {
    confirmBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(modal);
    });
  }

  // 5. '닫기(X)' 버튼 클릭 시 모달 닫기
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(modal);
    });
  }
}
