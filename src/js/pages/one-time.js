/**
 * RMHC Korea 일시후원 (one-time.html) 페이지 전용 스크립트 모듈
 * 동적 scrollHeight 실시간 계산 기반 60fps 크로스 슬라이딩 아코디언 제어 로직 탑재
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const form = document.getElementById('oneTimeDonateForm');
  
  // 아코디언 카드 노드
  const step1Card = document.getElementById('step1Card');
  const step2Card = document.getElementById('step2Card');
  const step3Card = document.getElementById('step3Card');
  
  // 아코디언 헤더 요약 텍스트
  const step1Summary = document.getElementById('step1Summary');
  const step2Summary = document.getElementById('step2Summary');
  const step3Summary = document.getElementById('step3Summary');
  
  // 1단계: 금액 설정
  const amountChips = step1Card.querySelectorAll('.chip-btn');
  const directInputChip = step1Card.querySelector('.direct-input-chip');
  const directAmountInput = document.getElementById('directAmount');
  const helperBoxes = step1Card.querySelectorAll('.notice-yellow-box');
  const step1NextWrap = document.getElementById('step1NextWrap');
  const btnStep1Next = document.getElementById('btnStep1Next');
  
  // 2단계: 후원자 정보
  const donorTypeChips = document.getElementById('donorTypeGrid').querySelectorAll('.chip-btn');
  const authRequestArea = document.getElementById('authRequestArea');
  const authInfoArea = document.getElementById('authInfoArea');
  const btnKakaoAuth = document.getElementById('btnKakaoAuth');
  const btnPassAuth = document.getElementById('btnPassAuth');
  const receiptRadios = document.getElementsByName('receiptRequest');
  const receiptDetailArea = document.getElementById('receiptDetailArea');
  const residentNumInput = document.getElementById('residentNum');
  
  // 약관동의
  const agreeAll = document.getElementById('agreeAll');
  const agreeItems = document.getElementsByName('agreeItem');
  
  // 3단계: 결제수단
  const paymentChips = step3Card.querySelectorAll('.payment-tabs-grid .payment-tab-btn');
  const btnPrevStep = document.getElementById('btnPrevStep');
  const btnSubmitDonate = document.getElementById('btnSubmitDonate');

  // --- State Variables ---
  let selectedAmount = ''; // 초기 미선택
  let isAmountValid = false;
  let selectedDonorType = '개인';
  let isAuthenticated = false;
  let selectedPayment = '';
  let isDirectMode = false; // 직접 입력 인풋 모드 여부

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
      setTimeout(() => {
        summaryElement.textContent = '';
      }, 150);
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
      setTimeout(() => {
        openCard(activeCardNode, activeSummaryElement, activeGuideText);
      }, 50);
    }
  }

  // 초기 렌더링 시 첫 번째 카드의 maxHeight 강제 동적 설정 (모션 오류 예방)
  setTimeout(() => {
    const firstBody = step1Card.querySelector('.card-body');
    if (firstBody) {
      firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
    }
  }, 100);

  // --- 1단계: 후원 금액 설정 로직 ---
  
  // 일반 5개 칩 클릭 이벤트
  amountChips.forEach((chip, chipIndex) => {
    chip.addEventListener('click', () => {
      isDirectMode = false;
      
      // 모든 일반 칩 액티브 해제 및 직접 입력 칩 포커스 제거
      amountChips.forEach(c => c.classList.remove('active'));
      directInputChip.classList.remove('active');
      
      chip.classList.add('active');
      directAmountInput.value = '';
      
      const val = chip.getAttribute('data-value');
      selectedAmount = formatNumber(val);
      isAmountValid = true;

      // 1:1 배너 매칭 노출 작동
      updateHelperBox(chipIndex);

      // 다음 버튼 노출 및 높이 갱신
      step1NextWrap.style.display = 'block';
      const body = step1Card.querySelector('.card-body');
      body.style.maxHeight = body.scrollHeight + 'px';
    });
  });

  // 직접 입력 인풋 칩 제어 (포커스 및 입력 시 칩 스타일 오버라이드)
  directAmountInput.addEventListener('focus', () => {
    isDirectMode = true;
    
    // 일반 칩 선택 해제 및 직접 입력 활성화 테두리 추가
    amountChips.forEach(c => c.classList.remove('active'));
    directInputChip.classList.add('active');
    
    // 6번째 헬퍼 배너(직접입력 매칭 배너) 노출
    updateHelperBox(5);
    
    validateDirectInput();
  });

  directAmountInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = val ? formatNumber(parseInt(val, 10)) : '';
    
    validateDirectInput();
  });

  // 직접 입력 실시간 검증 및 다음 버튼 노출 여부 결정 (임의 최소금액 에러 체크 제거)
  function validateDirectInput() {
    const rawVal = directAmountInput.value.replace(/[^0-9]/g, '');
    const numVal = parseInt(rawVal, 10);
    const body = step1Card.querySelector('.card-body');

    if (!numVal) {
      isAmountValid = false;
      step1NextWrap.style.display = 'none'; // 값이 없으면 다음 버튼 감춤
    } else {
      isAmountValid = true;
      selectedAmount = formatNumber(numVal);
      step1NextWrap.style.display = 'block'; // 금액이 입력되면 다음 버튼 표출
    }

    // 변경된 높이 실시간 적용
    body.style.maxHeight = body.scrollHeight + 'px';
  }

  // 1단계 전용 수동 "다음" 버튼 클릭 인터랙션
  btnStep1Next.addEventListener('click', () => {
    if (isAmountValid && selectedAmount !== '') {
      switchStep(
        step2Card, 
        step1Card, 
        step1Summary, 
        `일시 후원 ${selectedAmount}원`,
        step2Summary,
        ''
      );
    }
  });

  // --- 2단계: 후원자 정보입력 및 본인인증 로직 ---
  
  donorTypeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      donorTypeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      const type = chip.getAttribute('data-type');
      selectedDonorType = type === 'individual' ? '개인' : '기업 / 단체';
    });
  });

  // 본인인증 성공 시뮬레이션
  function handleAuthSuccess(providerName) {
    alert(`${providerName} 본인인증이 완료되었습니다.`);
    isAuthenticated = true;
    
    authRequestArea.style.display = 'none';
    authInfoArea.style.display = 'block';
    
    const body = step2Card.querySelector('.card-body');
    body.style.maxHeight = body.scrollHeight + 'px';
  }

  btnKakaoAuth.addEventListener('click', () => {
    handleAuthSuccess('카카오');
  });

  btnPassAuth.addEventListener('click', () => {
    handleAuthSuccess('휴대폰 (PASS)');
  });

  // 기부금 영수증 신청 여부 라디오 분기 처리
  receiptRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const body = step2Card.querySelector('.card-body');
      
      if (e.target.value === 'Y') {
        receiptDetailArea.style.display = 'block';
        residentNumInput.setAttribute('required', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        receiptDetailArea.style.display = 'none';
        residentNumInput.removeAttribute('required');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // 약관동의 제어
  agreeAll.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    agreeItems.forEach(item => {
      item.checked = isChecked;
    });
    checkAgreementAndProceed();
  });

  agreeItems.forEach(item => {
    item.addEventListener('change', () => {
      const allChecked = Array.from(agreeItems).every(i => i.checked);
      agreeAll.checked = allChecked;
      checkAgreementAndProceed();
    });
  });

  // 약관동의 여부 및 필수값 체크 후 3단계 이동
  function checkAgreementAndProceed() {
    if (!isAuthenticated) return;
    
    const requiredAgreed = Array.from(agreeItems)
      .filter(i => i.classList.contains('required-agree'))
      .every(i => i.checked);
      
    const receiptReq = form.querySelector('input[name="receiptRequest"]:checked').value;
    let residentNumValid = true;
    
    if (receiptReq === 'Y') {
      residentNumValid = residentNumInput.value.trim().length === 13;
    }

    if (requiredAgreed && residentNumValid) {
      switchStep(
        step3Card, 
        step2Card, 
        step2Summary, 
        selectedDonorType,
        step3Summary,
        ''
      );
    }
  }

  // 주민등록번호 13자리 입력 체크
  residentNumInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = val;
    checkAgreementAndProceed();
  });

  // --- 3단계: 결제 수단 로직 ---
  
  paymentChips.forEach(chip => {
    chip.addEventListener('click', () => {
      paymentChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      let payName = chip.querySelector('span') ? chip.querySelector('span').textContent : '기타결제';
      
      selectedPayment = payName;
      step3Summary.textContent = selectedPayment;
      
      btnSubmitDonate.classList.add('active');
    });
  });

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
        if (card === step1Card) closeCard(card, step1Summary, selectedAmount ? `일시 후원 ${selectedAmount}원` : '');
        else if (card === step2Card) closeCard(card, step2Summary, isAuthenticated ? selectedDonorType : '');
        else if (card === step3Card) closeCard(card, step3Summary, selectedPayment || '');
      } else {
        [step1Card, step2Card, step3Card].forEach(c => {
          if (c !== card && c.classList.contains('is-active')) {
            if (c === step1Card) closeCard(c, step1Summary, selectedAmount ? `일시 후원 ${selectedAmount}원` : '');
            else if (c === step2Card) closeCard(c, step2Summary, isAuthenticated ? selectedDonorType : '');
            else if (c === step3Card) closeCard(c, step3Summary, selectedPayment || '');
          }
        });
        
        if (card === step1Card) openCard(card, step1Summary, '');
        else if (card === step2Card) openCard(card, step2Summary, '');
        else if (card === step3Card) openCard(card, step3Summary, '');
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
    
    alert(`성공적으로 일시 후원이 완료되었습니다.\n후원 금액: ${selectedAmount}원\n결제 수단: ${selectedPayment}`);
    location.href = '/donate/complete.html';
  });
});
