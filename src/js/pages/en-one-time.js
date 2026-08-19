/**
 * RMHC Korea 영문 기부 (en/donate/one-time.html) 단일 페이지 통합 스크립트 모듈
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. 정기 / 일시 후원 최상위 탭 전환 (한 페이지 내 인디케이터 슬라이딩 및 뷰 전환) ---
  const donateTypeTabsWrapper = document.getElementById('donateTypeTabs');
  const btnMonthlyTab = document.getElementById('tabMonthly');
  const btnOneTimeTab = document.getElementById('tabOneTime');

  const chkRecurringWrap = document.getElementById('chkRecurringWrap');
  const monthlySectionWrap = document.getElementById('monthlySectionWrap');
  const oneTimeSectionWrap = document.getElementById('oneTimeSectionWrap');
  const chkBusiness = document.getElementById('chkBusiness');
  const businessNameArea = document.getElementById('businessNameArea');
  const businessNameInput = document.getElementById('businessName');

  let currentTab = 'one-time';

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

  function switchTab(type) {
    if (!donateTypeTabsWrapper) return;

    currentTab = type;

    if (donateTypeTabsWrapper.classList.contains('initial-one-time')) {
      donateTypeTabsWrapper.classList.remove('initial-one-time');
    }

    if (type === 'monthly') {
      // Monthly 탭 활성화 (왼쪽 슬라이딩)
      donateTypeTabsWrapper.classList.remove('is-one-time');
      if (btnMonthlyTab) btnMonthlyTab.classList.remove('disabled');
      if (btnOneTimeTab) btnOneTimeTab.classList.add('disabled');

      if (chkRecurringWrap) chkRecurringWrap.style.display = 'flex';
      if (monthlySectionWrap) monthlySectionWrap.style.display = 'block';
      if (oneTimeSectionWrap) oneTimeSectionWrap.style.display = 'none';
    } else {
      // One-time 탭 활성화 (오른쪽 슬라이딩)
      donateTypeTabsWrapper.classList.add('is-one-time');
      if (btnOneTimeTab) btnOneTimeTab.classList.remove('disabled');
      if (btnMonthlyTab) btnMonthlyTab.classList.add('disabled');

      if (chkRecurringWrap) chkRecurringWrap.style.display = 'none';
      if (monthlySectionWrap) monthlySectionWrap.style.display = 'none';
      if (oneTimeSectionWrap) oneTimeSectionWrap.style.display = 'block';
    }

    updateBusinessNameVisibility();
  }

  if (btnMonthlyTab) {
    btnMonthlyTab.addEventListener('click', () => switchTab('monthly'));
  }
  if (btnOneTimeTab) {
    btnOneTimeTab.addEventListener('click', () => switchTab('one-time'));
  }

  // --- 3. 금액 선택 칩 & Other 버튼 / 직접 입력 & notice-yellow-box 동적 갱신 ---
  const amountGrid = document.getElementById('enAmountGrid');
  const amountChips = amountGrid ? amountGrid.querySelectorAll('.btn:not(#btnOtherAmount)') : [];
  const btnOtherAmount = document.getElementById('btnOtherAmount');
  const directInputChip = document.getElementById('directInputChip');
  const directAmountInput = document.getElementById('directAmount');
  const noticeBoxSpan = document.querySelector('#enNoticeBox span');
  const noticeBoxImg = document.querySelector('#enNoticeBox img');

  const helperMessages = {
    '10': { text: 'Send comfort and encouragement to a family', img: '/src/images/donate/icon_helper_1.png' },
    '25': { text: 'Provide a warm meal for a family', img: '/src/images/donate/icon_helper_2.png' },
    '50': { text: 'Give a family a comfortable place to rest', img: '/src/images/donate/icon_helper_3.png' },
    '100': { text: 'Support a family for a full day', img: '/src/images/donate/icon_helper_4.png' },
    '250': { text: 'Give more families a night together', img: '/src/images/donate/icon_helper_5.png' },
    'other': { text: 'Help a family every step of the way', img: '/src/images/donate/icon_helper_6.png' },
  };

  function updateEnNoticeBox(key) {
    const info = helperMessages[key] || helperMessages['other'];
    if (noticeBoxSpan && noticeBoxImg && info) {
      noticeBoxSpan.textContent = info.text;
      noticeBoxImg.src = info.img;
    }
  }

  amountChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      // 모든 금액 칩 및 Other 버튼 비활성화 (btn-outline)
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

      // 클릭한 칩 활성화 (btn-primary)
      chip.classList.remove('btn-outline');
      chip.classList.add('btn-primary');

      const val = chip.getAttribute('data-value');
      updateEnNoticeBox(val);
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
      updateEnNoticeBox('other');
    });
  }

  if (directAmountInput) {
    directAmountInput.addEventListener('focus', () => {
      if (directInputChip) directInputChip.classList.add('active', 'is-active');
      autoResizeInput(directAmountInput);
      updateEnNoticeBox('other');
    });

    directAmountInput.addEventListener('input', (e) => {
      let rawVal = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = rawVal ? Number(rawVal).toLocaleString('en-US') : '';
      autoResizeInput(directAmountInput);
      updateEnNoticeBox('other');
    });
  }

  // 결제 수단 선택 버튼 토글 (Apple Pay / Credit Card)
  const paymentBtns = document.querySelectorAll('.en-payment-btn');
  paymentBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      paymentBtns.forEach((b) => {
        b.classList.remove('btn-primary', 'is-active');
        b.classList.add('btn-outline');
      });
      btn.classList.remove('btn-outline');
      btn.classList.add('btn-primary', 'is-active');
    });
  });

  // --- 4. Business Name 체크박스 토글 (Monthly 탭에서만 동작) ---
  if (chkBusiness) {
    chkBusiness.addEventListener('change', () => {
      updateBusinessNameVisibility();
    });
  }

  // --- 5. Tax Receipt Accordion Toggle (Billing Information 카드) ---
  const taxReceiptHeader = document.getElementById('taxReceiptHeader');
  const taxReceiptBody = document.getElementById('taxReceiptBody');
  const taxAccordionIcon = document.getElementById('taxAccordionIcon');

  if (taxReceiptHeader && taxReceiptBody) {
    taxReceiptHeader.addEventListener('click', () => {
      const isHidden = taxReceiptBody.style.display === 'none' || getComputedStyle(taxReceiptBody).display === 'none';
      if (isHidden) {
        taxReceiptBody.style.display = 'block';
        if (taxAccordionIcon) taxAccordionIcon.src = '/src/images/common/icon_nav_arrow_up.svg';
      } else {
        taxReceiptBody.style.display = 'none';
        if (taxAccordionIcon) taxAccordionIcon.src = '/src/images/common/icon_nav_arrow_down.svg';
      }
    });
  }

  // --- 6. 폼 제출 기본 방지 ---
  const form = document.getElementById('enDonateForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }
});
