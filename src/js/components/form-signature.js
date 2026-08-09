/**
 * form-signature.js — 출금동의 서명 캔버스 드로잉 및 리셋 전역 공통 모듈
 */

export function initSignatureCanvas() {
  // DOM 완료 및 동적 요소 노출(탭 전환, 모달 오픈 등) 시 캔버스 바인딩
  setupSignature();

  document.addEventListener('click', (e) => {
    if (e.target.closest('.payment-tab-btn, .btn-open-popup, .modal-overlay, [data-tab-target]')) {
      setTimeout(setupSignature, 60);
    }
  });
}

export function setupSignature() {
  const canvases = document.querySelectorAll('#signatureCanvas, canvas.signature-canvas');
  canvases.forEach((canvas) => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }

    // 초기 크기 동기화 시도
    resizeCanvas();

    // 중복 바인딩 방지
    if (canvas.dataset.signatureInitialized === 'true') return;
    canvas.dataset.signatureInitialized = 'true';

    let isDrawing = false;

    function getMousePos(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    function getTouchPos(e) {
      const rect = canvas.getBoundingClientRect();
      if (!e.touches || e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }

    function startDrawing(e) {
      resizeCanvas();
      isDrawing = true;
      const pos = getMousePos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    function startDrawingTouch(e) {
      e.preventDefault();
      resizeCanvas();
      isDrawing = true;
      const pos = getTouchPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
      if (!isDrawing) return;
      const pos = getMousePos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function drawTouch(e) {
      e.preventDefault();
      if (!isDrawing) return;
      const pos = getTouchPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function stopDrawing() {
      isDrawing = false;
    }

    // 마우스 이벤트 바인딩
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('mouseenter', resizeCanvas);

    // 모바일 터치 이벤트 바인딩
    canvas.addEventListener('touchstart', startDrawingTouch, { passive: false });
    canvas.addEventListener('touchmove', drawTouch, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    // 리셋 버튼 이벤트 바인딩 (자식/부모 전역 검색)
    const container = canvas.closest('.signature-pad-wrapper, .payment-form-field, .payment-tab-content') || document;
    const clearBtns = container.querySelectorAll('#btnSignatureClear, .btn-signature-clear');

    clearBtns.forEach((btn) => {
      if (btn.dataset.signatureClearBound === 'true') return;
      btn.dataset.signatureClearBound = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    });
  });
}
