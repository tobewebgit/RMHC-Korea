/**
 * agreement.js - 이용약관 및 수신동의 전체선택/개별선택 제어 (공통 컴포넌트)
 */
export function initAgreementEvents() {
  const agreeAll = document.getElementById("agree-all");
  if (!agreeAll) return; // 해당 페이지에 약관 전체동의 요소가 없으면 실행 안 함

  const agreeTerms = document.getElementById("agree-terms");
  const agreePrivacy = document.getElementById("agree-privacy");
  const agreeMarketing = document.getElementById("agree-marketing");
  
  // 존재하는 약관 체크박스들만 필터링하여 배열 구성
  const childAgreements = [agreeTerms, agreePrivacy, agreeMarketing].filter(Boolean);

  // 1. 전체 동의 체크박스 변경 시 하위 체크박스 동시 제어
  agreeAll.addEventListener("change", function () {
    const checked = this.checked;
    childAgreements.forEach((checkbox) => {
      checkbox.checked = checked;
    });
  });

  // 2. 하위 체크박스 변경 시 전체 동의 체크박스 상태 동기화
  childAgreements.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const allChecked = childAgreements.every((cb) => cb.checked);
      agreeAll.checked = allChecked;
    });
  });
}
