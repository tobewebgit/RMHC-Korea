import { initNavigation } from './components/navigation.js';
import { initMobileGnb } from './components/gnb.js';
import { initFamilySite } from './components/family-site.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. 공통 레이아웃 기능 초기화
  initNavigation();
  initMobileGnb();
  initFamilySite();

  console.log('RMHC Portal template initialized successfully.');
});
