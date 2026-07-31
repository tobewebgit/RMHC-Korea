/**
 * RMHC Korea 영문 일시후원 (en/donate/one-time.html) 전용 스크립트 모듈
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const form = document.getElementById('enOneTimeDonateForm');
  
  // 공통 커스텀 셀렉트박스 (.custom-select) 바인딩
  const customSelects = document.querySelectorAll('.custom-select');
  customSelects.forEach((select) => {
    const summary = select.querySelector('summary');
    const hiddenInput = select.querySelector('input[type="hidden"]');
    const options = select.querySelectorAll('ul li');

    options.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        const val = opt.getAttribute('data-value') || opt.textContent.trim();
        const txt = opt.textContent.trim();
        if (summary) summary.textContent = txt;
        if (hiddenInput) {
          hiddenInput.value = val;
          hiddenInput.dispatchEvent(new Event('change'));
        }
        select.removeAttribute('open');
      });
    });
  });

  // 외부 영역 클릭 시 열린 custom-select 닫기
  document.addEventListener('click', (e) => {
    customSelects.forEach((sb) => {
      if (!sb.contains(e.target)) {
        sb.removeAttribute('open');
      }
    });
  });
  
  // 정기/일시 탭 버튼 (국문 스크립트 패턴과 100% 동일)
  const donateTypeTabsWrapper = document.querySelector('.donate-type-tabs');
  const donateTypeTabs = donateTypeTabsWrapper ? donateTypeTabsWrapper.querySelectorAll('.btn-tab') : [];

  if (donateTypeTabsWrapper && donateTypeTabs.length > 0) {
    donateTypeTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        if (donateTypeTabsWrapper.classList.contains('initial-one-time')) {
          donateTypeTabsWrapper.classList.remove('initial-one-time');
        }

        if (index === 0) {
          // Monthly (첫 번째 탭 선택) -> 왼쪽 슬라이딩
          donateTypeTabsWrapper.classList.remove('is-one-time');
          donateTypeTabs[0].classList.remove('disabled');
          donateTypeTabs[1].classList.add('disabled');
        } else {
          // One-time (두 번째 탭 선택) -> 오른쪽 슬라이딩
          donateTypeTabsWrapper.classList.add('is-one-time');
          donateTypeTabs[1].classList.remove('disabled');
          donateTypeTabs[0].classList.add('disabled');
        }
      });
    });
  }

  // 금액 선택 칩 & 직접 입력
  const amountGrid = document.getElementById('enAmountGrid');
  const amountChips = amountGrid ? amountGrid.querySelectorAll('.btn-outline:not(#btnOtherAmount)') : [];
  const btnOtherAmount = document.getElementById('btnOtherAmount');
  const directInputChip = document.getElementById('directInputChip');
  const directAmountInput = document.getElementById('directAmount');
  const noticeBoxSpan = document.querySelector('#enNoticeBox span');
  const noticeBoxImg = document.querySelector('#enNoticeBox img');

  // 금액별 메시지 및 아이콘 맵 (6종 전수 매칭)
  const helperMessages = {
    '10': { text: 'Send comfort and encouragement to a family', img: '/src/images/donate/icon_helper_1.png' },
    '25': { text: 'Provide a warm meal for a family', img: '/src/images/donate/icon_helper_2.png' },
    '50': { text: 'Give a family a comfortable place to rest', img: '/src/images/donate/icon_helper_3.png' },
    '100': { text: 'Support a family for a full day', img: '/src/images/donate/icon_helper_4.png' },
    '250': { text: 'Give more families a night together', img: '/src/images/donate/icon_helper_5.png' },
    'other': { text: 'Help a family every step of the way', img: '/src/images/donate/icon_helper_6.png' },
  };

  let selectedAmount = '50';

  function updateEnNoticeBox(key) {
    const info = helperMessages[key] || helperMessages['other'];
    if (noticeBoxSpan && noticeBoxImg && info) {
      noticeBoxSpan.textContent = info.text;
      noticeBoxImg.src = info.img;
    }
  }

  // 일반 금액 칩($10~$250) 클릭 이벤트
  amountChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      amountChips.forEach((c) => c.classList.remove('is-active'));
      if (btnOtherAmount) btnOtherAmount.classList.remove('is-active');

      chip.classList.add('is-active');

      // 인풋 칩 감추고 Other 버튼 노출
      if (directInputChip) directInputChip.style.display = 'none';
      if (btnOtherAmount) btnOtherAmount.style.display = 'inline-flex';
      if (directAmountInput) directAmountInput.value = '';

      const val = chip.getAttribute('data-value');
      selectedAmount = val;

      updateEnNoticeBox(val);
    });
  });

  // Other 버튼 클릭 이벤트 -> 인풋 칩으로 교체, 6번째 헬퍼 메시지 변경 및 즉시 포커스
  if (btnOtherAmount) {
    btnOtherAmount.addEventListener('click', () => {
      amountChips.forEach((c) => c.classList.remove('is-active'));
      btnOtherAmount.style.display = 'none';
      if (directInputChip) {
        directInputChip.style.display = 'block';
      }
      if (directAmountInput) {
        directAmountInput.value = '';
        directAmountInput.focus();
      }

      updateEnNoticeBox('other');
    });
  }

  // 직접 입력 인풋 처리
  if (directAmountInput) {
    directAmountInput.addEventListener('focus', () => {
      updateEnNoticeBox('other');
    });

    directAmountInput.addEventListener('input', (e) => {
      let rawVal = e.target.value.replace(/[^0-9]/g, '');
      if (rawVal) {
        e.target.value = '$' + Number(rawVal).toLocaleString('en-US');
        selectedAmount = rawVal;
      } else {
        e.target.value = '';
        selectedAmount = '';
      }
      updateEnNoticeBox('other');
    });
  }

  // --- 결제 수단 선택 ---
  const btnApplePay = document.getElementById('btnApplePay');
  const btnDonateCard = document.getElementById('btnDonateCard');

  if (btnApplePay && btnDonateCard) {
    btnApplePay.addEventListener('click', () => {
      btnApplePay.classList.add('primary-active', 'is-active');
      btnDonateCard.classList.remove('primary-active', 'is-active');
    });

    btnDonateCard.addEventListener('click', () => {
      btnDonateCard.classList.add('primary-active', 'is-active');
      btnApplePay.classList.remove('primary-active', 'is-active');
    });
  }

  // --- Tax Receipt Accordion Toggle (Billing Information 카드 내부 토글) ---
  const taxReceiptHeader = document.getElementById('taxReceiptHeader');
  const taxReceiptBody = document.getElementById('taxReceiptBody');
  const taxAccordionIcon = document.getElementById('taxAccordionIcon');

  const ICON_DOWN = '/src/images/common/icon_nav_arrow_down.svg';
  const ICON_UP = '/src/images/common/icon_nav_arrow_up.svg';

  if (taxReceiptHeader && taxReceiptBody) {
    taxReceiptHeader.addEventListener('click', () => {
      const isHidden = taxReceiptBody.style.display === 'none' || getComputedStyle(taxReceiptBody).display === 'none';
      if (isHidden) {
        taxReceiptBody.style.display = 'block';
        if (taxAccordionIcon) taxAccordionIcon.src = ICON_UP;
      } else {
        taxReceiptBody.style.display = 'none';
        if (taxAccordionIcon) taxAccordionIcon.src = ICON_DOWN;
      }
    });
  }

  // --- 폼 제출 Validation ---
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const requiredIds = [
        { id: 'firstName', name: 'First Name' },
        { id: 'lastName', name: 'Last Name' },
        { id: 'userEmail', name: 'Email' },
        { id: 'postalCode', name: 'Postal Code' },
        { id: 'addressLine1', name: 'Address Line 1' },
        { id: 'city', name: 'City' },
        { id: 'stateProvince', name: 'State / Province' }
      ];

      for (const field of requiredIds) {
        const inputEl = document.getElementById(field.id);
        if (!inputEl || !inputEl.value.trim()) {
          alert(`Please fill out the required field: ${field.name}`);
          if (inputEl) inputEl.focus();
          return;
        }
      }

      alert('Thank you for your donation! Payment request processed.');
    });
  }
});
