export function initFab() {
  const snsToggleBtn = document.querySelector('.fab-sns-toggle');
  const snsWrap = document.querySelector('.fab-sns-wrap');

  if (snsToggleBtn && snsWrap) {
    snsToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      snsWrap.classList.toggle('is-active');
    });

    // 버튼 외부 영역을 클릭하면 닫히도록 처리
    document.addEventListener('click', (e) => {
      if (!snsWrap.contains(e.target)) {
        snsWrap.classList.remove('is-active');
      }
    });
  }
}
