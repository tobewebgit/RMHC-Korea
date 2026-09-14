/**
 * RMHC Korea 영문 기부 (en/donate/one-time.html) 단일 페이지 통합 스크립트 모듈
 */
import { initCustomSelect } from '../components/form-select.js';

document.addEventListener('DOMContentLoaded', () => {
  // 공통 커스텀 셀렉트박스 초기화
  initCustomSelect();

  // --- 1. 정기 / 일시 후원 최상위 탭 전환 (한 페이지 내 인디케이터 슬라이딩 및 뷰 전환) ---
  const donateTypeTabsWrapper = document.getElementById('donateTypeTabs');
  const btnMonthlyTab = document.getElementById('tabMonthly');
  const btnOneTimeTab = document.getElementById('tabOneTime');

  const chkRecurringWrap = document.getElementById('chkRecurringWrap');
  const chkRecurring = document.getElementById('chkRecurring');
  const recurringDayArea = document.getElementById('recurringDayArea');
  const cardInfoCard = document.getElementById('cardInfoCard');
  const chkBusiness = document.getElementById('chkBusiness');
  const businessNameArea = document.getElementById('businessNameArea');
  const businessNameInput = document.getElementById('businessName');

  // URL 파라미터 기반 탭 감지 (?tab=monthly | ?tab=one-time | ?tab=regular)
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');
  let currentTab = (tabParam === 'monthly' || tabParam === 'regular') ? 'monthly' : 'one-time';

  function updateBusinessNameVisibility() {
    if (!businessNameArea) return;
    if (currentTab === 'monthly' && chkBusiness && chkBusiness.checked) {
      businessNameArea.style.display = 'block';
      if (businessNameInput) businessNameInput.focus();
    } else {
      businessNameArea.style.display = 'none';
      if (businessNameInput) businessNameInput.value = '';
    }
  }

  function updateRecurringDayVisibility() {
    if (!recurringDayArea) return;
    if (currentTab === 'monthly' && chkRecurring && chkRecurring.checked) {
      recurringDayArea.style.display = 'block';
    } else {
      recurringDayArea.style.display = 'none';
    }
  }

  function switchTab(type) {
    if (!donateTypeTabsWrapper) return;

    currentTab = (type === 'monthly' || type === 'regular') ? 'monthly' : 'one-time';

    if (donateTypeTabsWrapper.classList.contains('initial-one-time')) {
      donateTypeTabsWrapper.classList.remove('initial-one-time');
    }

    if (currentTab === 'monthly') {
      // Monthly 탭 활성화 (왼쪽 슬라이딩)
      donateTypeTabsWrapper.classList.remove('is-one-time');
      if (btnMonthlyTab) btnMonthlyTab.classList.remove('disabled');
      if (btnOneTimeTab) btnOneTimeTab.classList.add('disabled');

      if (chkRecurringWrap) chkRecurringWrap.style.display = 'flex';
      if (cardInfoCard) cardInfoCard.style.display = 'block';
    } else {
      // One-time 탭 활성화 (오른쪽 슬라이딩)
      donateTypeTabsWrapper.classList.add('is-one-time');
      if (btnOneTimeTab) btnOneTimeTab.classList.remove('disabled');
      if (btnMonthlyTab) btnMonthlyTab.classList.add('disabled');

      if (chkRecurringWrap) chkRecurringWrap.style.display = 'none';
      if (recurringDayArea) recurringDayArea.style.display = 'none';
      if (cardInfoCard) cardInfoCard.style.display = 'none';
    }

    updateBusinessNameVisibility();
    updateRecurringDayVisibility();
  }

  if (btnMonthlyTab) {
    btnMonthlyTab.addEventListener('click', () => {
      const tabType = btnMonthlyTab.getAttribute('data-tab') || 'monthly';
      switchTab(tabType);
    });
  }
  if (btnOneTimeTab) {
    btnOneTimeTab.addEventListener('click', () => {
      const tabType = btnOneTimeTab.getAttribute('data-tab') || 'one-time';
      switchTab(tabType);
    });
  }

  // 초기 로드 시 탭 활성화 적용
  switchTab(currentTab);

  // --- 2. 금액 선택 칩 & Other 버튼 / 직접 입력 & 6종 헬퍼 박스 동적 제어 ---
  const step1Card = document.getElementById('step1Card');
  const amountGrid = document.getElementById('enAmountGrid');
  const amountChips = amountGrid ? amountGrid.querySelectorAll('.btn:not(#btnOtherAmount)') : [];
  const btnOtherAmount = document.getElementById('btnOtherAmount');
  const directInputChip = document.getElementById('directInputChip');
  const directAmountInput = document.getElementById('directAmount');
  const helperBoxes = step1Card ? step1Card.querySelectorAll('.notice-yellow-box') : [];

  // 6종 헬퍼 박스 동적 선택 노출 및 숨김 함수
  function updateHelperBox(activeIndex) {
    helperBoxes.forEach((box, index) => {
      if (index === activeIndex) {
        box.style.display = 'flex';
      } else {
        box.style.display = 'none';
      }
    });
  }

  // 초기 상태: 기본 선택된 $50(인덱스 2) 매칭 배너 노출
  updateHelperBox(2);

  amountChips.forEach((chip, chipIndex) => {
    chip.addEventListener('click', () => {
      amountChips.forEach((c) => {
        c.classList.remove('btn-primary');
        c.classList.add('btn-outline');
      });
      if (btnOtherAmount) {
        btnOtherAmount.classList.remove('btn-primary');
        btnOtherAmount.classList.add('btn-outline');
        btnOtherAmount.style.display = 'inline-flex';
      }
      if (directInputChip) {
        directInputChip.style.display = 'none';
        directInputChip.classList.remove('active', 'is-active');
      }
      if (directAmountInput) directAmountInput.value = '';

      chip.classList.remove('btn-outline');
      chip.classList.add('btn-primary');

      updateHelperBox(chipIndex);
    });
  });

  function autoResizeInput(input) {
    if (!input) return;
    const text = input.value || '';
    input.style.width = Math.max(1, text.length) + 'ch';
  }

  if (btnOtherAmount) {
    btnOtherAmount.addEventListener('click', () => {
      amountChips.forEach((c) => {
        c.classList.remove('btn-primary');
        c.classList.add('btn-outline');
      });
      btnOtherAmount.style.display = 'none';
      if (directInputChip) {
        directInputChip.style.display = 'inline-flex';
        directInputChip.classList.add('active', 'is-active');
      }
      if (directAmountInput) {
        directAmountInput.value = '';
        autoResizeInput(directAmountInput);
        directAmountInput.focus();
      }
      updateHelperBox(5);
    });
  }

  if (directAmountInput) {
    directAmountInput.addEventListener('focus', () => {
      if (directInputChip) directInputChip.classList.add('active', 'is-active');
      autoResizeInput(directAmountInput);
      updateHelperBox(5);
    });

    directAmountInput.addEventListener('input', (e) => {
      let rawVal = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = rawVal ? Number(rawVal).toLocaleString('en-US') : '';
      autoResizeInput(directAmountInput);
      updateHelperBox(5);
    });
  }

  // --- 3. Recurring Checkbox & Business Name 체크박스 토글 ---
  if (chkRecurring) {
    chkRecurring.addEventListener('change', () => {
      updateRecurringDayVisibility();
    });
  }

  if (chkBusiness) {
    chkBusiness.addEventListener('change', () => {
      updateBusinessNameVisibility();
    });
  }

  // --- 4. 카드 번호 및 유효기간 입력 포맷팅 제어 ---
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = formatted;
    });
  }

  const cardExpInput = document.getElementById('cardExp');
  if (cardExpInput) {
    cardExpInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) {
        e.target.value = val.substring(0, 2) + ' / ' + val.substring(2);
      } else {
        e.target.value = val;
      }
    });
  }

  // --- 5. 폼 제출 처리 및 유효성 검사 ---
  const form = document.getElementById('enDonateForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Monthly 정기 후원인 경우 유효성 검사
      if (currentTab === 'monthly') {
        if (!chkRecurring || !chkRecurring.checked) {
          alert('Please authorize recurring monthly donations to proceed.');
          if (chkRecurring) chkRecurring.focus();
          return;
        }

        const paymentDayInput = document.getElementById('paymentDay');
        if (!paymentDayInput || !paymentDayInput.value) {
          alert('Please select a monthly payment day.');
          const selectElem = document.getElementById('recurringDaySelect');
          if (selectElem) {
            selectElem.setAttribute('open', '');
            selectElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        const cardName = document.getElementById('cardName');
        if (cardName && !cardName.value.trim()) {
          alert('Please enter the name on your card.');
          cardName.focus();
          return;
        }

        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber && cardNumber.value.replace(/\s/g, '').length < 15) {
          alert('Please enter a valid card number.');
          cardNumber.focus();
          return;
        }

        const cardExp = document.getElementById('cardExp');
        if (cardExp && cardExp.value.trim().length < 5) {
          alert('Please enter the card expiration date (MM / YY).');
          cardExp.focus();
          return;
        }
      }

      // 공통 Billing Information 유효성 검사
      const firstName = document.getElementById('firstName');
      if (firstName && !firstName.value.trim()) {
        alert('Please enter your first name.');
        firstName.focus();
        return;
      }

      const lastName = document.getElementById('lastName');
      if (lastName && !lastName.value.trim()) {
        alert('Please enter your last name.');
        lastName.focus();
        return;
      }

      const userEmail = document.getElementById('userEmail');
      if (userEmail && !userEmail.value.trim()) {
        alert('Please enter your email address.');
        userEmail.focus();
        return;
      }

      const countryInput = document.getElementById('countryInput');
      if (countryInput && !countryInput.value) {
        alert('Please select your country.');
        const countrySelect = document.getElementById('countrySelect');
        if (countrySelect) countrySelect.setAttribute('open', '');
        return;
      }

      location.href = '/en/donate/complete.html';
    });
  }
});
