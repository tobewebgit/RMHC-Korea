/**
 * RMHC Korea 일시후원 (one-time.html) 페이지 전용 스크립트 모듈
 * 동적 scrollHeight 실시간 계산 기반 60fps 크로스 슬라이딩 아코디언 제어 로직 탑재
 */
import { setupSignature } from '../components/form-signature.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const form = document.getElementById('oneTimeDonateForm');
  
  // 최상위 정기/일시 후원 구분 탭 버튼
  const donateTypeTabs = document.querySelector('.donate-type-tabs') ? document.querySelector('.donate-type-tabs').querySelectorAll('.btn-tab') : [];

  // 아코디언 카드 노드
  const step1Card = document.getElementById('step1Card');
  const step2Card = document.getElementById('step2Card');
  const step3Card = document.getElementById('step3Card');
  
  // 아코디언 헤더 요약 텍스트
  const step1Summary = document.getElementById('step1Summary');
  const step2Summary = document.getElementById('step2Summary');
  const step3Summary = document.getElementById('step3Summary');
  
  // 1단계: 금액 설정
  const amountChips = step1Card.querySelectorAll('.chip-grid .btn:not(#btnDirectAmount)');
  const btnDirectAmount = document.getElementById('btnDirectAmount');
  const directInputChip = document.getElementById('directInputChip') || step1Card.querySelector('.direct-input-chip');
  const directAmountInput = document.getElementById('directAmount');
  const amountWarningText = document.getElementById('amountWarningText');
  const helperBoxes = step1Card.querySelectorAll('.notice-yellow-box');
  const step1NextWrap = document.getElementById('step1NextWrap');
  const btnStep1Next = document.getElementById('btnStep1Next');
  
  // 2단계: 후원자 정보 (join/form.html 2분할 사양 매핑)
  const donorTypeChips = document.getElementById('donorTypeGrid').querySelectorAll('.btn');
  const authRequestArea = document.getElementById('authRequestArea');
  const authInfoArea = document.getElementById('authInfoArea');
  const groupInfoArea = document.getElementById('groupInfoArea');
  const step2CommonArea = document.getElementById('step2CommonArea');
  const groupName = document.getElementById('groupName');
  const groupBizNum = document.getElementById('groupBizNum');
  const groupManager = document.getElementById('groupManager');
  const groupPhone = document.getElementById('groupPhone');
  const groupEmail = document.getElementById('groupEmail');
  const btnKakaoAuth = document.getElementById('btnKakaoAuth');
  const btnPassAuth = document.getElementById('btnPassAuth');
  const receiptRadios = document.getElementsByName('receiptRequest');
  const receiptDetailArea = document.getElementById('receiptDetailArea');
  const receiptResidentNumArea = document.getElementById('receiptResidentNumArea');
  const receiptBizHelperArea = document.getElementById('receiptBizHelperArea');
  const residentNum1 = document.getElementById('residentNum1');
  const residentNum2 = document.getElementById('residentNum2');
  const btnStep2Prev = document.getElementById('btnStep2Prev');
  const btnStep2Next = document.getElementById('btnStep2Next');
  
  // 약관동의
  const agreeAll = document.getElementById('agree-all') || document.getElementById('agreeAll');
  const agreeItems = document.getElementsByName('agreeItem');
  
  // 3단계: 결제수단 및 상세 정보 폼
  const paymentChips = step3Card.querySelectorAll('.payment-tabs-grid .payment-tab-btn');
  const withdrawDayArea = document.getElementById('withdrawDayArea');
  const withdrawDayInput = document.getElementById('withdrawDay');
  const paymentDetailFormArea = document.getElementById('paymentDetailFormArea');
  const cardPaymentForm = document.getElementById('cardPaymentForm');
  const cmsPaymentForm = document.getElementById('cmsPaymentForm');
  const sameAsDonor = document.getElementById('sameAsDonor');
  
  const pmCardCompany = document.getElementById('pm_card_company');
  const pmCardNumber = document.getElementById('pm_card_number');
  const pmExpMonth = document.getElementById('pm_exp_month');
  const pmExpYear = document.getElementById('pm_exp_year');
  const pmOwnerName = document.getElementById('pm_owner_name');
  const pmOwnerBirth = document.getElementById('pm_owner_birth');
  
  const pmCmsBank = document.getElementById('pm_cms_bank');
  const pmCmsAccount = document.getElementById('pm_cms_account');
  const pmCmsOwner = document.getElementById('pm_cms_owner');
  const pmCmsBirth = document.getElementById('pm_cms_birth');
  
  const signatureCanvas = document.getElementById('signatureCanvas');
  const btnSignatureClear = document.getElementById('btnSignatureClear');
  
  const btnPrevStep = document.getElementById('btnPrevStep');
  const btnSubmitDonate = document.getElementById('btnSubmitDonate');

  // --- State Variables ---
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');
  let activeDonateTab = (tabParam === 'regular') ? 'regular' : 'one-time'; // 'regular' | 'one-time'
  let selectedAmount = '';
  let isAmountValid = false;
  let selectedDonorType = 'individual'; // 'individual' | 'group'
  let isAuthenticated = false;
  let selectedPayment = '';
  let isDirectMode = false;
  let signatureDrawn = false;

  // --- DOM Element Text Helpers (HTML DOM 기반 동적 텍스트 캡처 및 추출) ---
  
  // 셀렉트박스 초기 HTML 텍스트 캡처 (HTML에 정의된 텍스트 원본 보존)
  const cardLabel = document.getElementById('cardCompanySelectLabel');
  const initialCardLabelText = cardLabel ? cardLabel.textContent : '';
  const bankLabel = document.getElementById('cmsBankSelectLabel');
  const initialBankLabelText = bankLabel ? bankLabel.textContent : '';
  const withdrawLabel = document.getElementById('withdrawDaySelectLabel');
  const initialWithdrawLabelText = withdrawLabel ? withdrawLabel.textContent : '';
  const expMonthLabel = document.getElementById('expMonthSelectLabel');
  const initialExpMonthLabelText = expMonthLabel ? expMonthLabel.textContent : '';
  const expYearLabel = document.getElementById('expYearSelectLabel');
  const initialExpYearLabelText = expYearLabel ? expYearLabel.textContent : '';

  // 1단계 요약: ID 및 Class 선택자로 활성 탭 및 단위 텍스트 캡처
  function getStep1SummaryText() {
    if (!selectedAmount) return '';
    const activeTab = document.querySelector('.donate-type-tabs .btn-tab:not(.disabled)') || document.querySelector('.donate-type-tabs .btn-tab.active');
    const tabLabel = activeTab ? activeTab.textContent.trim() : '';
    const unitEl = document.querySelector('.direct-input-chip .unit');
    const unitText = unitEl ? unitEl.textContent.trim() : '';
    return `${tabLabel} ${selectedAmount}${unitText}`;
  }

  // 2단계 요약: #donorTypeGrid 내의 .btn-primary 칩 텍스트 캡처
  function getStep2SummaryText() {
    if (!isAuthenticated) return '';
    const activeChip = document.querySelector('#donorTypeGrid .btn.btn-primary');
    const donorLabel = activeChip ? activeChip.textContent.trim() : '';
    return `${donorLabel}(인증 완료)`;
  }

  // 3단계 요약: .payment-tabs-grid 내의 활성 결제 버튼 텍스트 캡처
  function getStep3SummaryText() {
    if (!selectedPayment) return '';
    const activeChip = document.querySelector(`.payment-tabs-grid .payment-tab-btn[data-pay="${selectedPayment}"]`) || document.querySelector('.payment-tabs-grid .payment-tab-btn.btn-primary');
    if (!activeChip) return '';
    const labelSpan = activeChip.querySelector('span');
    return labelSpan ? labelSpan.textContent.trim() : activeChip.textContent.trim();
  }

  // --- 아코디언 타이틀 우측 가이드/요약 초기 텍스트 설정 (임의 가이드 제거, 빈 칸 복원) ---
  step1Summary.textContent = ''; 
  step2Summary.textContent = '';
  step3Summary.textContent = '';

  // --- 6종 헬퍼 박스 동적 선택 노출 및 숨김 함수 ---
  function updateHelperBox(activeIndex) {
    helperBoxes.forEach((box, index) => {
      if (index === activeIndex) {
        box.style.display = 'flex';
      } else {
        box.style.display = 'none';
      }
    });

    // 배너 노출에 따른 scrollHeight 실시간 높이값 재조정
    const body = step1Card.querySelector('.card-body');
    if (body && step1Card.classList.contains('is-active')) {
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  }

  // 초기 상태: 배너 6종 및 다음 버튼 전체 감춤 처리
  helperBoxes.forEach(box => box.style.display = 'none');
  step1NextWrap.style.display = 'none';

  // --- 고품질 동적 아코디언 오픈/클로즈 유틸리티 함수 ---
  
  // 카드 부드럽게 열기
  function openCard(card, summaryElement, defaultGuideText = '') {
    card.classList.remove('is-disabled');
    card.classList.add('is-active');
    
    if (summaryElement) {
      summaryElement.style.opacity = '0';
      summaryElement.textContent = '';
    }
    
    const body = card.querySelector('.card-body');
    if (!body) return;

    body.style.maxHeight = body.scrollHeight + 'px';
    
    const onTransitionEnd = () => {
      if (card.classList.contains('is-active')) {
        body.style.maxHeight = 'none';
      }
      body.removeEventListener('transitionend', onTransitionEnd);
    };
    body.addEventListener('transitionend', onTransitionEnd);
  }

  // 카드 부드럽게 닫기
  function closeCard(card, summaryElement, summaryText) {
    const body = card.querySelector('.card-body');
    if (!body) return;

    body.style.maxHeight = body.scrollHeight + 'px';
    body.offsetHeight; 
    body.style.maxHeight = '0px';
    card.classList.remove('is-active');

    if (summaryElement && summaryText) {
      summaryElement.textContent = summaryText;
      summaryElement.style.opacity = '1';
    }
  }

  // 아코디언 크로스 슬라이딩 전환 제어 함수
  function switchStep(activeCardNode, closeCardNode, closeSummaryElement, closeSummaryText, activeSummaryElement, activeGuideText) {
    if (closeCardNode) {
      closeCardNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      closeCard(closeCardNode, closeSummaryElement, closeSummaryText);
    }
    if (activeCardNode) {
      // 강제 렌더링 동기화
      activeCardNode.offsetHeight;
      openCard(activeCardNode, activeSummaryElement, activeGuideText);
    }
  }

  // 초기 렌더링 시 첫 번째 카드의 maxHeight 강제 동적 설정 (지연 없이 즉시 반영)
  const firstBody = step1Card.querySelector('.card-body');
  if (firstBody) {
    firstBody.offsetHeight;
    firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
  }

  // --- 1단계: 후원 금액 설정 로직 ---
  
  // 일반 5개 칩 클릭 이벤트
  amountChips.forEach((chip, chipIndex) => {
    chip.addEventListener('click', () => {
      isDirectMode = false;
      
      // 모든 일반 칩 액티브 해제 및 직접 입력 칩 포커스 제거
      amountChips.forEach(c => {
        c.classList.remove('btn-primary');
        c.classList.add('btn-outline');
      });
      if (btnDirectAmount) {
        btnDirectAmount.classList.remove('btn-primary');
        btnDirectAmount.classList.add('btn-outline');
        btnDirectAmount.style.display = '';
      }
      if (directInputChip) {
        directInputChip.style.display = 'none';
        directInputChip.classList.remove('active');
      }
      
      chip.classList.remove('btn-outline');
      chip.classList.add('btn-primary');
      if (directAmountInput) directAmountInput.value = '';
      
      const val = chip.getAttribute('data-value');
      selectedAmount = formatNumber(val);
      isAmountValid = true;

      // 1:1 배너 매칭 노출 작동
      updateHelperBox(chipIndex);

      // 다음 버튼 노출 및 높이 갱신
      if (amountWarningText) amountWarningText.style.display = 'none';
      step1NextWrap.style.display = 'block';
      const body = step1Card.querySelector('.card-body');
      body.style.maxHeight = body.scrollHeight + 'px';
    });
  });

  // 유동적 인풋 너비 동적 조절 함수 (Fallback)
  function autoResizeInput(input) {
    if (!input) return;
    const text = input.value || '';
    input.style.width = Math.max(1, text.length) + 'ch';
  }

  // 직접 입력 버튼 클릭 시 인풋 칩으로 전환
  if (btnDirectAmount) {
    btnDirectAmount.addEventListener('click', () => {
      isDirectMode = true;
      
      // 일반 칩 선택 해제
      amountChips.forEach(c => {
        c.classList.remove('btn-primary');
        c.classList.add('btn-outline');
      });

      // 버튼 숨기고 인풋 칩 노출 및 포커스
      btnDirectAmount.style.display = 'none';
      if (directInputChip) {
        directInputChip.style.display = 'inline-flex';
        directInputChip.classList.add('active');
      }
      if (directAmountInput) {
        directAmountInput.value = '';
        autoResizeInput(directAmountInput);
        directAmountInput.focus();
      }
      
      // 6번째 헬퍼 배너(직접입력 매칭 배너) 노출
      updateHelperBox(5);
      
      validateDirectInput();
    });
  }

  // 직접 입력 인풋 칩 제어 (포커스 및 입력 시 칩 스타일 오버라이드)
  if (directAmountInput) {
    directAmountInput.addEventListener('focus', () => {
      isDirectMode = true;
      
      // 일반 칩 선택 해제 및 직접 입력 활성화 테두리 추가
      amountChips.forEach(c => {
        c.classList.remove('btn-primary');
        c.classList.add('btn-outline');
      });
      if (directInputChip) directInputChip.classList.add('active');
      autoResizeInput(directAmountInput);
      
      // 6번째 헬퍼 배너(직접입력 매칭 배너) 노출
      updateHelperBox(5);
      
      validateDirectInput();
    });

    // 직접 입력 금액 포맷팅 연동
    directAmountInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = val ? formatNumber(parseInt(val, 10)) : '';
      autoResizeInput(directAmountInput);
      
      validateDirectInput();
    });
  }

  // 직접 입력 실시간 검증 및 다음 버튼 노출 여부 결정
  function validateDirectInput() {
    const rawVal = directAmountInput.value.replace(/[^0-9]/g, '');
    const numVal = parseInt(rawVal, 10);
    const body = step1Card.querySelector('.card-body');

    if (!numVal) {
      isAmountValid = false;
      if (amountWarningText) amountWarningText.style.display = 'none';
      step1NextWrap.style.display = 'none'; // 값이 없으면 다음 버튼 감춤
    } else if (numVal < 10000) {
      isAmountValid = false;
      if (amountWarningText) amountWarningText.style.display = 'block'; // 10,000원 미만 시 경고 노출
      step1NextWrap.style.display = 'none'; // 다음 버튼 감춤
    } else {
      isAmountValid = true;
      selectedAmount = formatNumber(numVal);
      if (amountWarningText) amountWarningText.style.display = 'none'; // 10,000원 이상 시 경고 숨김
      step1NextWrap.style.display = 'block'; // 다음 버튼 표출
    }

    body.style.maxHeight = body.scrollHeight + 'px';
  }

  // 1단계 전용 수동 "다음" 버튼 클릭 인터랙션
  btnStep1Next.addEventListener('click', () => {
    if (isAmountValid && selectedAmount !== '') {
      switchStep(
        step2Card, 
        step1Card, 
        step1Summary, 
        getStep1SummaryText(),
        step2Summary,
        ''
      );
    }
  });

  // --- 전체 폼 상태 초기화 함수 (최상위 탭 전환 시 호출) ---
  function resetAllSteps() {
    try {
      // 1. 모든 상태 변수 초기화
      selectedAmount = '';
      isAmountValid = false;
      isAuthenticated = false;
      selectedPayment = '';
      signatureDrawn = false;

      // 2. 1단계 금액 초기화
      amountChips.forEach(c => {
        c.classList.remove('btn-primary');
        c.classList.add('btn-outline');
      });
      if (btnDirectAmount) {
        btnDirectAmount.classList.remove('btn-primary');
        btnDirectAmount.classList.add('btn-outline');
        btnDirectAmount.style.display = '';
      }
      if (directInputChip) {
        directInputChip.style.display = 'none';
        directInputChip.classList.remove('active');
      }
      if (directAmountInput) {
        directAmountInput.value = '';
        autoResizeInput(directAmountInput);
      }
      if (amountWarningText) amountWarningText.style.display = 'none';
      if (step1NextWrap) step1NextWrap.style.display = 'none';
      helperBoxes.forEach(box => box.style.display = 'none');

      // 3. 2단계 후원자 정보 초기화
      selectedDonorType = 'individual';
      donorTypeChips.forEach(c => {
        if (c.getAttribute('data-type') === 'individual') {
          c.classList.remove('btn-outline');
          c.classList.add('btn-primary');
        } else {
          c.classList.remove('btn-primary');
          c.classList.add('btn-outline');
        }
      });
      [groupName, groupBizNum, groupManager, groupPhone, groupEmail, residentNum1, residentNum2].forEach(input => {
        if (input) input.value = '';
      });
      if (residentNum1) residentNum1.removeAttribute('required');
      if (residentNum2) residentNum2.removeAttribute('required');
      
      receiptRadios.forEach(radio => {
        radio.checked = false;
      });
      if (agreeAll) agreeAll.checked = false;
      agreeItems.forEach(item => {
        item.checked = false;
      });

      // 4. 3단계 결제 정보 초기화
      paymentChips.forEach(chip => {
        chip.classList.remove('btn-primary');
        chip.classList.add('btn-outline');
      });
      if (sameAsDonor) sameAsDonor.checked = false;
      toggleSameAsDonor(false);

      [pmCardNumber, pmOwnerName, pmOwnerBirth, pmCmsAccount, pmCmsOwner, pmCmsBirth].forEach(input => {
        if (input) {
          input.value = '';
          input.removeAttribute('disabled');
        }
      });

      // 셀렉트박스 원본 HTML 텍스트로 복원
      if (cardLabel) cardLabel.textContent = initialCardLabelText;
      const pmCardCompanyInput = document.getElementById('pm_card_company');
      if (pmCardCompanyInput) pmCardCompanyInput.value = '';

      if (bankLabel) bankLabel.textContent = initialBankLabelText;
      const pmCmsBankInput = document.getElementById('pm_cms_bank');
      if (pmCmsBankInput) pmCmsBankInput.value = '';

      if (withdrawLabel) withdrawLabel.textContent = initialWithdrawLabelText;
      if (withdrawDayInput) withdrawDayInput.value = '';

      if (expMonthLabel) expMonthLabel.textContent = initialExpMonthLabelText;
      const pmExpMonthInput = document.getElementById('pm_exp_month');
      if (pmExpMonthInput) pmExpMonthInput.value = '';

      if (expYearLabel) expYearLabel.textContent = initialExpYearLabelText;
      const pmExpYearInput = document.getElementById('pm_exp_year');
      if (pmExpYearInput) pmExpYearInput.value = '';

      if (signatureCanvas) {
        const signatureCtx = signatureCanvas.getContext('2d');
        if (signatureCtx) {
          signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        }
      }

      // 5. 아코디언 상태 초기화 (1단계 오픈, 2/3단계 비활성 및 닫힘)
      closeCard(step2Card, step2Summary, '');
      closeCard(step3Card, step3Summary, '');
      step2Card.classList.add('is-disabled');
      step3Card.classList.add('is-disabled');

      step1Summary.textContent = '';
      step2Summary.textContent = '';
      step3Summary.textContent = '';

      openCard(step1Card, step1Summary, '');
      // 탭 전환 동기화 시점에 비주얼 리렌더링 연동
      updateDonateFlowUI();


    } catch (err) {
      console.error("[resetAllSteps] Reset Exception:", err);
    }
  }

  // 전체 기부 플로우 상태 기반 통합 렌더링 함수
  function updateDonateFlowUI() {
    try {
      const step2Body = step2Card.querySelector('.card-body');
      const step3Body = step3Card.querySelector('.card-body');
      
      // 1. 최상위 정기/일시 탭 버튼 비주얼 클래스 동기화
      const donateTypeTabsWrapper = document.querySelector('.donate-type-tabs');
      if (donateTypeTabsWrapper) {
        if (activeDonateTab === 'one-time') {
          donateTypeTabsWrapper.classList.add('is-one-time');
          donateTypeTabsWrapper.classList.remove('is-regular');
        } else {
          donateTypeTabsWrapper.classList.add('is-regular');
          donateTypeTabsWrapper.classList.remove('is-one-time');
        }
      }

      donateTypeTabs.forEach((tab) => {
        const tabType = tab.getAttribute('data-tab');
        if (tabType === activeDonateTab) {
          tab.classList.remove('disabled');
        } else {
          tab.classList.add('disabled');
        }
      });

      // 2. 1단계 아코디언 헤더 요약 텍스트 업데이트
      step1Summary.textContent = getStep1SummaryText();

      // 3. 2단계 아코디언 헤더 요약 텍스트 업데이트
      step2Summary.textContent = getStep2SummaryText();

      // 4. 2단계 후원자 유형별 (개인 / 기업) UI 가시성 및 인증 영역 제어
      if (selectedDonorType === 'individual') {
        if (authRequestArea) authRequestArea.style.display = 'block'; // 본인인증 영역 항상 보임
        if (authInfoArea) authInfoArea.style.display = isAuthenticated ? 'block' : 'none'; // 인증 정보 폼
        if (groupInfoArea) groupInfoArea.style.display = 'none'; // 기업용 폼 가림
        if (step2CommonArea) step2CommonArea.style.display = isAuthenticated ? 'block' : 'none'; // 약관동의 공통 영역
      } else {
        if (authRequestArea) authRequestArea.style.display = 'block'; // 기업도 인증 전에는 요청 영역 노출
        if (authInfoArea) authInfoArea.style.display = 'none';
        if (groupInfoArea) groupInfoArea.style.display = isAuthenticated ? 'block' : 'none'; // 기업용 정보 폼
        if (step2CommonArea) step2CommonArea.style.display = isAuthenticated ? 'block' : 'none'; // 약관동의 공통 영역
      }

      // 2단계 기부금 영수증 영역 제어
      const receiptRadioChecked = form ? form.querySelector('input[name="receiptRequest"]:checked') : null;
      const receiptReq = receiptRadioChecked ? receiptRadioChecked.value : '';

      if (isAuthenticated && receiptReq === 'Y') {
        if (receiptDetailArea) receiptDetailArea.style.display = 'block';
        if (selectedDonorType === 'individual') {
          if (receiptResidentNumArea) receiptResidentNumArea.style.display = 'block';
          if (receiptBizHelperArea) receiptBizHelperArea.style.display = 'none';
          if (residentNum1) residentNum1.setAttribute('required', 'true');
          if (residentNum2) residentNum2.setAttribute('required', 'true');
        } else {
          if (receiptResidentNumArea) receiptResidentNumArea.style.display = 'none';
          if (receiptBizHelperArea) receiptBizHelperArea.style.display = 'block';
          if (residentNum1) residentNum1.removeAttribute('required');
          if (residentNum2) residentNum2.removeAttribute('required');
        }
      } else {
        if (receiptDetailArea) receiptDetailArea.style.display = 'none';
        if (residentNum1) residentNum1.removeAttribute('required');
        if (residentNum2) residentNum2.removeAttribute('required');
      }

      // 2단계 필수 약관 동의 체크
      const requiredAgreed = Array.from(agreeItems || [])
        .filter(i => i && i.classList && i.classList.contains('required-agree'))
        .every(i => i.checked);

      // 2단계 정보 폼 및 유효성 판단
      let step2FieldsValid = false;
      let residentNumValid = true;

      if (selectedDonorType === 'individual') {
        if (isAuthenticated) {
          step2FieldsValid = true;
          if (receiptReq === 'Y') {
            const frontVal = residentNum1 ? residentNum1.value.trim() : '';
            const backVal = residentNum2 ? residentNum2.value.trim() : '';
            residentNumValid = (frontVal.length === 6) && (backVal.length === 7);
          } else if (receiptReq === 'N') {
            residentNumValid = true;
          } else {
            residentNumValid = false;
          }
        }
      } else {
        if (isAuthenticated) {
          const nameVal = groupName ? groupName.value.trim() : '';
          const managerVal = groupManager ? groupManager.value.trim() : '';
          const phoneVal = groupPhone ? groupPhone.value.trim() : '';
          const emailVal = groupEmail ? groupEmail.value.trim() : '';
          step2FieldsValid = (nameVal !== '') && (managerVal !== '') && (phoneVal !== '') && (emailVal !== '');
          
          if (receiptReq === 'Y' || receiptReq === 'N') {
            residentNumValid = true;
          } else {
            residentNumValid = false;
          }
        }
      }

      // 2단계 다음 버튼 제어
      if (btnStep2Next) {
        if (requiredAgreed && step2FieldsValid && residentNumValid) {
          btnStep2Next.removeAttribute('disabled');
        } else {
          btnStep2Next.setAttribute('disabled', 'true');
        }
      }

      // 5. 3단계 결제 수단 가시성 및 칩 제어
      paymentChips.forEach(chip => {
        const payVal = chip.getAttribute('data-pay');
        
        // 정기/일시 관계없이 모든 결제수단 탭 활성화 (정기일 때 간편결제를 비활성화하던 코드 완전 삭제!)
        chip.classList.remove('disabled');
        chip.removeAttribute('disabled');

        // 활성 수단 비주얼 처리
        if (selectedPayment === payVal) {
          chip.classList.remove('btn-outline');
          chip.classList.add('btn-primary');
        } else {
          chip.classList.remove('btn-primary');
          chip.classList.add('btn-outline');
        }
      });

      // [파이프라인 분리 핵심] 일시 후원 vs 정기 후원 UI 제어
      if (activeDonateTab === 'one-time') {
        // [일시 후원 파이프라인] - 출금일 및 카드/CMS 상세 정보 입력 박스는 아예 숨김 처리
        if (withdrawDayArea) withdrawDayArea.style.display = 'none';
        if (paymentDetailFormArea) paymentDetailFormArea.style.display = 'none';
      } else {
        // [정기 후원 파이프라인] - 출금일 영역 항상 노출
        if (withdrawDayArea) withdrawDayArea.style.display = 'block';

        const showDetailForm = ['card', 'cms'].includes(selectedPayment);
        if (paymentDetailFormArea) {
          paymentDetailFormArea.style.display = showDetailForm ? 'block' : 'none';
        }
        if (cardPaymentForm) {
          cardPaymentForm.style.display = (selectedPayment === 'card') ? 'flex' : 'none';
        }
        if (cmsPaymentForm) {
          cmsPaymentForm.style.display = (selectedPayment === 'cms') ? 'flex' : 'none';
        }
      }

      // 6. 3단계 결제 유효성 검사 및 최종 후원하기 버튼 제어
      let isPaymentValid = false;
      let withdrawDayValid = true;

      if (activeDonateTab === 'one-time') {
        // 일시 후원은 결제 수단만 선택되면 바로 '후원하기' 활성화 (PG 처리 대상)
        isPaymentValid = (selectedPayment !== '');
        withdrawDayValid = true;
      } else {
        // 정기 후원은 출금일 필수 선택
        const withdrawDayVal = withdrawDayInput ? withdrawDayInput.value : '';
        withdrawDayValid = (withdrawDayVal !== '');

        if (selectedPayment) {
          if (selectedPayment === 'card') {
            const companyVal = pmCardCompany ? pmCardCompany.value : '';
            const cardNumVal = pmCardNumber ? pmCardNumber.value.trim() : '';
            const expMonthVal = pmExpMonth ? pmExpMonth.value : '';
            const expYearVal = pmExpYear ? pmExpYear.value : '';
            const ownerNameVal = pmOwnerName ? pmOwnerName.value.trim() : '';
            const ownerBirthVal = pmOwnerBirth ? pmOwnerBirth.value.trim() : '';

            isPaymentValid = (companyVal !== '') && (cardNumVal.length >= 15) && 
                             (expMonthVal !== '') && (expYearVal !== '') && 
                             (ownerNameVal !== '') && (ownerBirthVal.length === 8);
          } else if (selectedPayment === 'cms') {
            const bankVal = pmCmsBank ? pmCmsBank.value : '';
            const accountVal = pmCmsAccount ? pmCmsAccount.value.trim() : '';
            const ownerVal = pmCmsOwner ? pmCmsOwner.value.trim() : '';
            const birthVal = pmCmsBirth ? pmCmsBirth.value.trim() : '';

            isPaymentValid = (bankVal !== '') && (accountVal !== '') && 
                             (ownerVal !== '') && (birthVal.length === 8) && 
                             signatureDrawn;
          } else {
            // 정기 후원이라도 간편결제(카카오, 네이버, 토스)는 PG 연동 방식이므로 바로 유효
            isPaymentValid = true;
          }
        }
      }

      // 3단계 헤더 요약 텍스트 업데이트
      step3Summary.textContent = getStep3SummaryText();

      if (btnSubmitDonate) {
        if (isPaymentValid && withdrawDayValid) {
          btnSubmitDonate.removeAttribute('disabled');
        } else {
          btnSubmitDonate.setAttribute('disabled', 'true');
        }
      }

      // 7. 아코디언 패널 실시간 높이 동적 리사이징
      if (step2Body && step2Card.classList.contains('is-active')) {
        step2Body.style.maxHeight = step2Body.scrollHeight + 'px';
      }
      if (step3Body && step3Card.classList.contains('is-active')) {
        step3Body.style.maxHeight = step3Body.scrollHeight + 'px';
      }

    } catch (err) {
      console.error("[updateDonateFlowUI] Render Exception:", err);
    }
  }

  // --- 이벤트 리스너 리액티브 바인딩 ---

  // 최상위 탭 전환 리스너 (data-tab 속성 기반)
  donateTypeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabType = tab.getAttribute('data-tab');
      activeDonateTab = (tabType === 'regular') ? 'regular' : 'one-time';

      // 최초 로드 시 설정된 애니메이션 방지 클래스 제거
      const donateTypeTabsWrapper = document.getElementById('donateTypeTabs');
      if (donateTypeTabsWrapper && donateTypeTabsWrapper.classList.contains('initial-one-time')) {
        donateTypeTabsWrapper.classList.remove('initial-one-time');
      }

      // 탭 전환 시 전체 상태 및 폼 필드 초기화
      resetAllSteps();
    });
  });

  // 2단계 후원자 유형 탭 클릭 리스너
  donorTypeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      donorTypeChips.forEach(c => {
        c.classList.remove('btn-primary');
        c.classList.add('btn-outline');
      });
      chip.classList.remove('btn-outline');
      chip.classList.add('btn-primary');
      
      const type = chip.getAttribute('data-type');
      selectedDonorType = type === 'group' ? 'group' : 'individual';

      updateDonateFlowUI();
    });
  });

  // 본인인증 성공 시뮬레이션
  function handleAuthSuccess(providerName) {
    isAuthenticated = true;
    updateDonateFlowUI();
  }

  if (btnKakaoAuth) {
    btnKakaoAuth.addEventListener('click', () => {
      handleAuthSuccess('카카오');
    });
  }

  if (btnPassAuth) {
    btnPassAuth.addEventListener('click', () => {
      handleAuthSuccess('휴대폰 (PASS)');
    });
  }

  // 기부금 영수증 신청 여부 라디오 분기 처리
  receiptRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      updateDonateFlowUI();
    });
  });

  // 주민등록번호 앞자리 입력 제어
  if (residentNum1) {
    residentNum1.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = val;
      if (val.length === 6 && residentNum2) {
        residentNum2.focus();
      }
      updateDonateFlowUI();
    });
  }

  // 주민등록번호 뒷자리 입력 제어
  if (residentNum2) {
    residentNum2.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = val;
      updateDonateFlowUI();
    });
  }

  // 주민등록번호 뒷자리 눈모양 마스킹 토글 기능은 전역 common.js(form-eye.js)에서 일괄 처리됩니다.

  // 기업용 입력 필드 실시간 유효성 체크
  [groupName, groupManager, groupEmail].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        updateDonateFlowUI();
      });
    }
  });

  // 사업자번호 숫자만 입력 제어
  if (groupBizNum) {
    groupBizNum.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
      updateDonateFlowUI();
    });
  }

  // 담당자 연락처 숫자만 입력 제어
  if (groupPhone) {
    groupPhone.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
      updateDonateFlowUI();
    });
  }

  // 약관동의 제어 (전체 선택)
  if (agreeAll) {
    agreeAll.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      agreeItems.forEach(item => {
        item.checked = isChecked;
      });
      updateDonateFlowUI();
    });
  }

  // 약관동의 제어 (개별 선택)
  agreeItems.forEach(item => {
    item.addEventListener('change', () => {
      const allChecked = Array.from(agreeItems).every(i => i.checked);
      if (agreeAll) {
        agreeAll.checked = allChecked;
      }
      updateDonateFlowUI();
    });
  });

  // 2단계 이전 버튼 클릭 시 1단계로 슬라이딩 회귀
  btnStep2Prev.addEventListener('click', () => {
    switchStep(
      step1Card,
      step2Card,
      step2Summary,
      '',
      step1Summary,
      ''
    );
  });

  // 2단계 다음 버튼 클릭 시 3단계 카드로 슬라이딩
  btnStep2Next.addEventListener('click', () => {
    if (!btnStep2Next.hasAttribute('disabled')) {
      switchStep(
        step3Card, 
        step2Card, 
        step2Summary, 
        getStep2SummaryText(),
        step3Summary,
        ''
      );
      // 3단계 카드 열릴 때 캔버스 렌더링 동기화
      initSignatureCanvas();
    }
  });

  // --- 3단계 전용 제어 및 서명 드로잉 엔진 ---

  // 결제 탭 클릭 리스너
  paymentChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (chip.hasAttribute('disabled')) return;

      const payVal = chip.getAttribute('data-pay');
      selectedPayment = payVal;

      updateDonateFlowUI();
      if (selectedPayment === 'cms') {
        initSignatureCanvas();
      }
    });
  });

  // '후원자와 동일' 체크 기능
  if (sameAsDonor) {
    sameAsDonor.addEventListener('change', (e) => {
      toggleSameAsDonor(e.target.checked);
      updateDonateFlowUI();
    });
  }

  function toggleSameAsDonor(isSame) {
    if (isSame) {
      // 본인인증으로 획득한 기본 정보 자동 매핑 (로날드, 19880101)
      if (pmOwnerName) {
        pmOwnerName.value = '로날드';
        pmOwnerName.setAttribute('disabled', 'true');
      }
      if (pmOwnerBirth) {
        pmOwnerBirth.value = '19880101';
        pmOwnerBirth.setAttribute('disabled', 'true');
      }
      if (pmCmsOwner) {
        pmCmsOwner.value = '로날드';
        pmCmsOwner.setAttribute('disabled', 'true');
      }
      if (pmCmsBirth) {
        pmCmsBirth.value = '19880101';
        pmCmsBirth.setAttribute('disabled', 'true');
      }
    } else {
      if (pmOwnerName) {
        pmOwnerName.value = '';
        pmOwnerName.removeAttribute('disabled');
      }
      if (pmOwnerBirth) {
        pmOwnerBirth.value = '';
        pmOwnerBirth.removeAttribute('disabled');
      }
      if (pmCmsOwner) {
        pmCmsOwner.value = '';
        pmCmsOwner.removeAttribute('disabled');
      }
      if (pmCmsBirth) {
        pmCmsBirth.value = '';
        pmCmsBirth.removeAttribute('disabled');
      }
    }
  }

  // 3단계 입력 폼 실시간 유효성 체크
  [pmCardNumber, pmOwnerName, pmOwnerBirth, pmCmsAccount, pmCmsOwner, pmCmsBirth].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        updateDonateFlowUI();
      });
    }
  });

  [withdrawDayInput, pmCardCompany, pmExpMonth, pmExpYear, pmCmsBank].forEach(input => {
    if (input) {
      input.addEventListener('change', () => {
        updateDonateFlowUI();
      });
    }
  });

  // 카드번호/소유자생년월일/계좌번호/생년월일 숫자만 입력
  [pmCardNumber, pmOwnerBirth, pmCmsAccount, pmCmsBirth].forEach(input => {
    if (input) {
      input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
      });
    }
  });

  // 서명 캔버스 드로잉 엔진 (common form-signature.js 연동)
  function initSignatureCanvas() {
    setupSignature();
  }

  // 이전 버튼 클릭 시 2단계로 크로스 슬라이딩 회귀
  btnPrevStep.addEventListener('click', () => {
    switchStep(
      step2Card, 
      step3Card, 
      step3Summary, 
      '',
      step2Summary,
      ''
    );
  });

  // --- 아코디언 타이틀 직접 클릭 토글 (잠금 해제된 단계만 작동) ---
  const cardHeaders = document.querySelectorAll('.accordion-card .card-title-wrap');
  cardHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.accordion-card');
      
      if (card.classList.contains('is-disabled')) return;
      
      if (card.classList.contains('is-active')) {
        if (card === step1Card) closeCard(card, step1Summary, getStep1SummaryText());
        else if (card === step2Card) closeCard(card, step2Summary, getStep2SummaryText());
        else if (card === step3Card) closeCard(card, step3Summary, getStep3SummaryText());
      } else {
        [step1Card, step2Card, step3Card].forEach(c => {
          if (c !== card && c.classList.contains('is-active')) {
            if (c === step1Card) closeCard(c, step1Summary, getStep1SummaryText());
            else if (c === step2Card) closeCard(c, step2Summary, getStep2SummaryText());
            else if (c === step3Card) closeCard(c, step3Summary, getStep3SummaryText());
          }
        });
        
        if (card === step1Card) openCard(card, step1Summary, '');
        else if (card === step2Card) openCard(card, step2Summary, '');
        else if (card === step3Card) {
          openCard(card, step3Summary, '');
          initSignatureCanvas();
        }
      }
    });
  });

  // 포맷팅 함수 (세자리 콤마)
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // 최종 폼 서밋
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('본인인증을 완료해 주세요.');
      return;
    }
    
    if (!selectedPayment) {
      alert('결제 수단을 선택해 주세요.');
      return;
    }
    
    const isEnPage = window.location.pathname.includes('/en/');
    location.href = isEnPage ? '/en/donate/complete.html' : '/donate/complete.html';
  });

  // --- 초기 로드 시 URL 파라미터(?tab=regular)에 따른 탭 활성화 및 초기화 ---
  if (tabParam === 'regular') {
    const donateTypeTabsWrapper = document.getElementById('donateTypeTabs');
    if (donateTypeTabsWrapper) {
      donateTypeTabsWrapper.classList.remove('initial-one-time');
    }
    resetAllSteps();
  } else {
    updateDonateFlowUI();
  }
});
