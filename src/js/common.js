import { initNavigation } from './components/navigation.js';
import { initMobileGnb } from './components/gnb.js';
import { initTabs } from './components/tab.js';
import { initNewsletter } from './components/newsletter.js';
import { initModal } from './components/modal.js';
import { initAgreementEvents } from './components/agreement.js';
import { initCustomSelect } from './components/form-select.js';
import { initCustomChips } from './components/form-chip.js';
import { initScrollMotions } from './components/motion.js';
import { initAlert, showAlert } from './components/alert.js';
import { initFab } from './components/fab.js';
import { initDonateBannerHeart } from './components/donate-banner.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. 공통 레이아웃 및 컴포넌트 기능 초기화
  initNavigation();
  initMobileGnb();
  initTabs();
  initNewsletter();
  initModal();
  initAgreementEvents();
  initCustomSelect();
  initCustomChips();
  initScrollMotions();
  initAlert();
  initFab();
  initDonateBannerHeart();

  // 전역 알럿 접근
  window.showAlert = showAlert;

  console.log('RMHC Portal template initialized successfully.');
});

