/**
 * form-select.js - 프로젝트 전역 커스텀 셀렉트박스 공통화 제어 (웹 접근성 콤보박스 패턴 준수)
 */
export function initCustomSelect() {
  const selectBoxes = document.querySelectorAll(".custom-select");
  
  selectBoxes.forEach((select) => {
    // 중복 바인딩 방지 플래그
    if (select.dataset.selectInitialized) return;
    select.dataset.selectInitialized = "true";

    const summary = select.querySelector("summary");
    const list = select.querySelector("ul");
    const hiddenInput = select.querySelector('input[type="hidden"]');

    // 옵션 목록 내 아이템 클릭 선택 기능
    if (list) {
      const options = list.querySelectorAll("li");
      options.forEach((opt) => {
        opt.addEventListener("click", function (e) {
          // data-value 속성이 있으면 그것을, 없으면 textContent 사용
          const val = this.getAttribute("data-value") || this.textContent.trim();
          const txt = this.textContent.trim();

          // 클릭한 대상이 <a> 태그(예: 링크 이동)인 경우 텍스트 업데이트만 하고 페이지 이동을 허용
          if (summary) {
            summary.textContent = txt;
          }
          if (hiddenInput) {
            hiddenInput.value = val;
            // 값 갱신 시 외부 리스너가 감지할 수 있도록 change 이벤트 방출
            hiddenInput.dispatchEvent(new Event("change"));
          }
          
          select.removeAttribute("open");
        });
      });
    }
  });

  // 외부 영역 클릭 시 모든 커스텀 셀렉트 드롭다운 닫기
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".custom-select").forEach((sb) => {
      if (!sb.contains(e.target)) {
        sb.removeAttribute("open");
      }
    });
  });

  // 하나의 셀렉트박스를 열 때 다른 열려있는 셀렉트박스 닫기
  document.querySelectorAll(".custom-select").forEach((select) => {
    select.addEventListener("toggle", function (e) {
      if (select.open) {
        document.querySelectorAll(".custom-select").forEach((sb) => {
          if (sb !== select && sb.open) {
            sb.removeAttribute("open");
          }
        });
      }
    });
  });
}
