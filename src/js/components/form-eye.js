/**
 * form-eye.js — 비밀번호 및 보안 입력 필드 눈 아이콘(Eye-Toggle) 전역 공통 모듈
 */

export function initEyeButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.eye-btn');
    if (!btn) return;

    const wrapper = btn.closest('.pw-input-wrapper, .form-control-with-icon, .resident-pw-wrap, .form-group');
    const input = wrapper ? wrapper.querySelector('input') : btn.previousElementSibling;

    if (input && (input.type === 'password' || input.type === 'text')) {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.classList.toggle('visible', isPassword);
      btn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
    }
  });
}
