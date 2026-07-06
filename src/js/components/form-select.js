/**
 * form-select.js - 프로젝트 전역 커스텀 셀렉트박스 공통화 제어 (웹 접근성 콤보박스 패턴 준수)
 */
export function initCustomSelect() {
  const selectBoxes = document.querySelectorAll(".custom-select");
  
  selectBoxes.forEach((select) => {
    // 중복 바인딩 방지 플래그
    if (select.dataset.selectInitialized) return;
    select.dataset.selectInitialized = "true";

    const label = select.querySelector(".custom-select-label");
    const list = select.querySelector(".custom-select-list");
    const hiddenInput = select.querySelector('input[type="hidden"]');

    // 1. 드롭다운 열기/닫기 토글
    select.addEventListener("click", function (e) {
      e.stopPropagation();
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      
      // 다른 모든 커스텀 셀렉트 드롭다운은 닫음
      document.querySelectorAll(".custom-select").forEach((sb) => {
        if (sb !== select) {
          sb.setAttribute("aria-expanded", "false");
        }
      });
      
      this.setAttribute("aria-expanded", !isExpanded);
    });

    // 2. 옵션 목록 내 아이템 클릭 선택 기능
    if (list) {
      const options = list.querySelectorAll("li");
      options.forEach((opt) => {
        opt.addEventListener("click", function (e) {
          e.stopPropagation();
          const val = this.getAttribute("data-value");
          const txt = this.textContent;

          if (label) {
            label.textContent = txt;
          }
          if (hiddenInput) {
            hiddenInput.value = val;
            // 값 갱신 시 외부 리스너가 감지할 수 있도록 change 이벤트 방출
            hiddenInput.dispatchEvent(new Event("change"));
          }
          select.setAttribute("aria-expanded", "false");
        });
      });
    }
  });

  // 3. 외부 영역 클릭 시 모든 커스텀 셀렉트 드롭다운 닫기
  document.addEventListener("click", function () {
    document.querySelectorAll(".custom-select").forEach((sb) => {
      sb.setAttribute("aria-expanded", "false");
    });
  });
}
