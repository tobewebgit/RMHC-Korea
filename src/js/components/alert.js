/**
 * RMHC Portal - 글로벌 공통 알럿/컨펌 스크립트 (src/js/components/alert.js)
 */

import { openModal, closeModal } from './modal.js';

let alertCallback = null;
let confirmCallback = null;
let cancelCallback = null;

// 현재 페이지가 영문인지 판별
function isEnglishPage() {
  return (
    document.documentElement.lang === 'en' ||
    window.location.pathname.startsWith('/en/') ||
    window.location.pathname === '/en'
  );
}

export function initAlert() {
  const modal = document.getElementById('modal-common-alert');
  if (!modal) return;

  const closeBtn = document.getElementById('btn-common-alert-close');
  const cancelBtn = document.getElementById('btn-common-alert-cancel');
  const confirmBtn = document.getElementById('btn-common-alert-confirm');

  // 영문 페이지일 경우 초기 기본 텍스트 및 aria-label 적용
  if (isEnglishPage()) {
    if (closeBtn) closeBtn.setAttribute('aria-label', 'Close');
    if (cancelBtn) {
      const cancelSpan = cancelBtn.querySelector('span');
      if (cancelSpan) cancelSpan.innerText = 'Cancel';
    }
    if (confirmBtn) {
      const confirmSpan = confirmBtn.querySelector('span');
      if (confirmSpan) confirmSpan.innerText = 'OK';
    }
  }

  // X 닫기 버튼 (기본 동작: 콜백 없이 닫거나 cancel 콜백 실행)
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(modal);
      if (cancelCallback) cancelCallback();
    });
  }

  // 취소하기 버튼
  if (cancelBtn) {
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(modal);
      if (cancelCallback) cancelCallback();
    });
  }

  // 확인 버튼
  if (confirmBtn) {
    confirmBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(modal);
      if (confirmCallback) confirmCallback();
      if (alertCallback) alertCallback();
    });
  }
}

/**
 * 공통 알럿 띄우기
 * @param {Object} options - 알럿 설정 객체
 * @param {string} [options.type='alert'] - 'alert' 또는 'confirm'
 * @param {string} options.title - 모달 제목 (필요 시)
 * @param {string} options.message - 모달 메시지 (줄바꿈 시 <br> 사용 가능)
 * @param {string} [options.confirmText] - 확인 버튼 텍스트 (생략 시 언어별 기본값 '확인' 또는 'OK'/'Confirm')
 * @param {string} [options.cancelText] - 취소 버튼 텍스트 (생략 시 언어별 기본값 '취소하기' 또는 'Cancel')
 * @param {Function} [options.onConfirm] - 확인 버튼 클릭 시 콜백
 * @param {Function} [options.onCancel] - 취소 버튼 또는 X 버튼 클릭 시 콜백
 */
export function showAlert(options = {}) {
  const modal = document.getElementById('modal-common-alert');
  if (!modal) {
    console.error('Common alert modal is not found in DOM.');
    return;
  }

  const isEn = isEnglishPage();
  const defaultConfirm = isEn ? (options.type === 'confirm' ? 'Confirm' : 'OK') : '확인';
  const defaultCancel = isEn ? 'Cancel' : '취소하기';

  const {
    type = 'alert',
    title = '',
    message = '',
    confirmText = defaultConfirm,
    cancelText = defaultCancel,
    onConfirm = null,
    onCancel = null,
    className = '',
    hideFooter = false
  } = options;

  // 1. 요소 찾기
  const containerEl = modal.querySelector('.common-alert-container');
  const titleEl = document.getElementById('common-alert-title');
  const descEl = document.getElementById('common-alert-desc');
  const footerEl = document.getElementById('common-alert-footer');
  const cancelBtn = document.getElementById('btn-common-alert-cancel');
  const confirmBtn = document.getElementById('btn-common-alert-confirm');
  const confirmBtnText = confirmBtn.querySelector('span');

  // 1.5 커스텀 클래스 제어
  if (containerEl) {
    containerEl.className = 'modal-container common-alert-container';
    if (className) {
      className.split(' ').filter(Boolean).forEach(cls => containerEl.classList.add(cls));
    }
  }

  // 2. 텍스트 바인딩
  if (title) {
    titleEl.innerHTML = title;
    titleEl.style.display = 'block';
  } else {
    titleEl.style.display = 'none';
  }

  if (message) {
    descEl.innerHTML = message;
    descEl.style.display = 'block';
  } else {
    descEl.style.display = 'none';
  }

  confirmBtnText.innerText = confirmText;

  // 3. 버튼 레이아웃 제어
  if (hideFooter) {
    footerEl.style.display = 'none';
  } else {
    footerEl.style.display = ''; // CSS 기본값 유지
    if (type === 'confirm') {
      footerEl.classList.add('type-confirm');
      cancelBtn.style.display = 'inline-flex';
      cancelBtn.querySelector('span').innerText = cancelText;
    } else {
      footerEl.classList.remove('type-confirm');
      cancelBtn.style.display = 'none';
    }
  }

  // 4. 콜백 초기화
  alertCallback = type === 'alert' ? onConfirm : null;
  confirmCallback = type === 'confirm' ? onConfirm : null;
  cancelCallback = onCancel;

  // 5. 띄우기
  openModal(modal);
}
