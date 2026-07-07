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
  const amountChips = step1Card.querySelectorAll('.chip-grid .btn');
  const directInputChip = step1Card.querySelector('.direct-input-chip');
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
      amountChips.forEach(c => {
        c.classList.remove('btn-primary');
        c.classList.add('btn-outline');
      });
      directInputChip.classList.remove('active');
      
      chip.classList.remove('btn-outline');
      chip.classList.add('btn-primary');
      directAmountInput.value = '';
      
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

  // 직접 입력 인풋 칩 제어 (포커스 및 입력 시 칩 스타일 오버라이드)
  directAmountInput.addEventListener('focus', () => {
    isDirectMode = true;
    
    // 일반 칩 선택 해제 및 직접 입력 활성화 테두리 추가
    amountChips.forEach(c => {
      c.classList.remove('btn-primary');
      c.classList.add('btn-outline');
    });
    directInputChip.classList.add('active');
    
    // 6번째 헬퍼 배너(직접입력 매칭 배너) 노출
    updateHelperBox(5);
    
    validateDirectInput();
  });

  // 직접 입력 금액 포맷팅 연동
  directAmountInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = val ? formatNumber(parseInt(val, 10)) : '';
    
    validateDirectInput();
  });

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
        `일시 후원 ${selectedAmount}원`,
        step2Summary,
        ''
      );
    }
  });

  // --- 2단계: 후원자 정보입력 및 본인인증 로직 (상태 기반 렌더링 파이프라인) ---

  // 2단계 UI 상태 통합 업데이트 함수 (단일 진입점)
  function updateStep2UI() {
    try {
      const body = step2Card.querySelector('.card-body');
      
      // 1. 기부금 영수증 선택 값 추출
      const receiptRadioChecked = form ? form.querySelector('input[name="receiptRequest"]:checked') : null;
      const receiptReq = receiptRadioChecked ? receiptRadioChecked.value : '';

      // 2. 후원자 유형별 (개인 / 기업) UI 가시성 스위칭
      if (selectedDonorType === '개인') {
        // [개인 후원]
        if (authRequestArea) authRequestArea.style.display = 'block'; // 본인인증 요청 버튼 영역 (유지)
        if (authInfoArea) authInfoArea.style.display = isAuthenticated ? 'block' : 'none'; // 인증 정보 입력 폼
        if (groupInfoArea) groupInfoArea.style.display = 'none'; // 기업용 폼 가림
        if (step2CommonArea) step2CommonArea.style.display = isAuthenticated ? 'block' : 'none'; // 약관동의 공통 영역
        
        // 기부금 영수증 세부 영역 스위칭
        if (isAuthenticated && receiptReq === 'Y') {
          if (receiptDetailArea) receiptDetailArea.style.display = 'block';
          if (receiptResidentNumArea) receiptResidentNumArea.style.display = 'block';
          if (receiptBizHelperArea) receiptBizHelperArea.style.display = 'none';
          if (residentNum1) residentNum1.setAttribute('required', 'true');
          if (residentNum2) residentNum2.setAttribute('required', 'true');
        } else {
          if (receiptDetailArea) receiptDetailArea.style.display = 'none';
          if (residentNum1) residentNum1.removeAttribute('required');
          if (residentNum2) residentNum2.removeAttribute('required');
        }
      } else {
        // [기업 / 단체 후원]
        if (authRequestArea) authRequestArea.style.display = 'block'; // 기업/단체도 인증 필수이므로 항상 유지
        if (authInfoArea) authInfoArea.style.display = 'none'; // 개인용 폼 가림
        if (groupInfoArea) groupInfoArea.style.display = isAuthenticated ? 'block' : 'none'; // 인증 성공 시에만 기업용 폼 노출
        if (step2CommonArea) step2CommonArea.style.display = isAuthenticated ? 'block' : 'none'; // 인증 성공 시에만 약관동의 노출
        
        // 기부금 영수증 세부 영역 스위칭
        if (isAuthenticated && receiptReq === 'Y') {
          if (receiptDetailArea) receiptDetailArea.style.display = 'block';
          if (receiptResidentNumArea) receiptResidentNumArea.style.display = 'none';
          if (receiptBizHelperArea) receiptBizHelperArea.style.display = 'block';
          if (residentNum1) residentNum1.removeAttribute('required');
          if (residentNum2) residentNum2.removeAttribute('required');
        } else {
          if (receiptDetailArea) receiptDetailArea.style.display = 'none';
        }
      }

      // 3. 아코디언 높이 갱신
      if (body) {
        body.style.maxHeight = body.scrollHeight + 'px';
      }

      // 4. 필수 약관 동의 체크
      const requiredAgreed = Array.from(agreeItems || [])
        .filter(i => i && i.classList && i.classList.contains('required-agree'))
        .every(i => i.checked);

      // 5. 후원 정보 유효성 검사
      let formFieldsValid = false;
      let residentNumValid = true;

      if (selectedDonorType === '개인') {
        if (!isAuthenticated) {
          if (btnStep2Next) btnStep2Next.setAttribute('disabled', 'true');
          return;
        }
        formFieldsValid = true;

        if (receiptReq === 'Y') {
          const frontVal = residentNum1 ? residentNum1.value.trim() : '';
          const backVal = residentNum2 ? residentNum2.value.trim() : '';
          residentNumValid = (frontVal.length === 6) && (backVal.length === 7);
        } else if (receiptReq === 'N') {
          residentNumValid = true;
        } else {
          residentNumValid = false; // 영수증 예/아니오 미선택
        }
      } else {
        if (!isAuthenticated) {
          if (btnStep2Next) btnStep2Next.setAttribute('disabled', 'true');
          return;
        }
        const nameVal = groupName ? groupName.value.trim() : '';
        const managerVal = groupManager ? groupManager.value.trim() : '';
        const phoneVal = groupPhone ? groupPhone.value.trim() : '';
        const emailVal = groupEmail ? groupEmail.value.trim() : '';

        formFieldsValid = (nameVal !== '') && (managerVal !== '') && (phoneVal !== '') && (emailVal !== '');

        if (receiptReq === 'Y' || receiptReq === 'N') {
          residentNumValid = true;
        } else {
          residentNumValid = false; // 영수증 예/아니오 미선택
        }
      }

      // 6. 다음 버튼 활성화 처리
      if (btnStep2Next) {
        if (requiredAgreed && formFieldsValid && residentNumValid) {
          btnStep2Next.removeAttribute('disabled');
        } else {
          btnStep2Next.setAttribute('disabled', 'true');
        }
      }
    } catch (err) {
      console.error("[updateStep2UI] Exception occurred:", err);
    }
  }

  // 후원자 유형 탭 클릭 리스너
  donorTypeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      donorTypeChips.forEach(c => {
        c.classList.remove('btn-primary');
        c.classList.add('btn-outline');
      });
      chip.classList.remove('btn-outline');
      chip.classList.add('btn-primary');
      
      const type = chip.getAttribute('data-type');
      selectedDonorType = type === 'individual' ? '개인' : '기업 / 단체';

      updateStep2UI();
    });
  });

  // 본인인증 성공 시뮬레이션
  function handleAuthSuccess(providerName) {
    isAuthenticated = true;
    updateStep2UI();
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
      updateStep2UI();
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
      updateStep2UI();
    });
  }

  // 주민등록번호 뒷자리 입력 제어
  if (residentNum2) {
    residentNum2.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = val;
      updateStep2UI();
    });
  }

  // 주민등록번호 뒷자리 눈모양 마스킹 토글
  const eyeButtons = step2Card.querySelectorAll('.eye-btn');
  eyeButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const input = this.previousElementSibling;
      if (input && (input.type === 'password' || input.type === 'text')) {
        if (input.type === 'password') {
          input.type = 'text';
          this.classList.add('visible');
        } else {
          input.type = 'password';
          this.classList.remove('visible');
        }
      }
    });
  });

  // 기업용 입력 필드 실시간 유효성 체크
  [groupName, groupManager, groupEmail].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        updateStep2UI();
      });
    }
  });

  // 사업자번호 숫자만 입력 제어
  if (groupBizNum) {
    groupBizNum.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
      updateStep2UI();
    });
  }

  // 담당자 연락처 숫자만 입력 제어
  if (groupPhone) {
    groupPhone.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
      updateStep2UI();
    });
  }

  // 약관동의 제어 (전체 선택)
  if (agreeAll) {
    agreeAll.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      agreeItems.forEach(item => {
        item.checked = isChecked;
      });
      updateStep2UI();
    });
  }

  // 약관동의 제어 (개별 선택)
  agreeItems.forEach(item => {
    item.addEventListener('change', () => {
      const allChecked = Array.from(agreeItems).every(i => i.checked);
      if (agreeAll) {
        agreeAll.checked = allChecked;
      }
      updateStep2UI();
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
        selectedDonorType,
        step3Summary,
        ''
      );
    }
  });

  // --- 3단계: 결제 수단 로직 ---
  
  paymentChips.forEach(chip => {
    chip.addEventListener('click', () => {
      paymentChips.forEach(c => {
        c.classList.remove('btn-primary');
        c.classList.add('btn-outline');
      });
      chip.classList.remove('btn-outline');
      chip.classList.add('btn-primary');
      
      let payName = chip.querySelector('span') ? chip.querySelector('span').textContent : '기타결제';
      
      selectedPayment = payName;
      step3Summary.textContent = selectedPayment;
      
      btnSubmitDonate.removeAttribute('disabled');
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
    
    const finalResidentVal = receiptRadios[0].checked ? `${residentNum1.value}-${residentNum2.value}` : '';
    alert(`성공적으로 일시 후원이 완료되었습니다.\n후원 금액: ${selectedAmount}원\n결제 수단: ${selectedPayment}`);
    location.href = '/donate/complete.html';
  });
});
