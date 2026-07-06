/**
 * form-chip.js - 프로젝트 전역 커스텀 칩(토글 버튼) 공통화 제어
 */
export function initCustomChips() {
  const chipButtons = document.querySelectorAll("[data-toggle-chip]");

  chipButtons.forEach((button) => {
    // 중복 바인딩 방지 플래그
    if (button.dataset.chipInitialized) return;
    button.dataset.chipInitialized = "true";

    button.addEventListener("click", function (e) {
      e.preventDefault();
      const groupName = this.getAttribute("data-toggle-chip");
      const value = this.getAttribute("data-chip-value");

      // 1. 해당 그룹의 모든 칩 버튼 비활성화
      const siblings = document.querySelectorAll(`[data-toggle-chip="${groupName}"]`);
      siblings.forEach((sib) => {
        sib.classList.remove("active");
        sib.setAttribute("aria-checked", "false");
      });

      // 2. 클릭한 칩 버튼 활성화
      this.classList.add("active");
      this.setAttribute("aria-checked", "true");

      // 3. 브릿지 hidden input 갱신 및 change 이벤트 방출
      const bridgeInput = document.getElementById(groupName);
      if (bridgeInput) {
        bridgeInput.value = value || "";
        bridgeInput.dispatchEvent(new Event("change"));
      }
    });
  });
}
