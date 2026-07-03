import { initNavigation } from './components/navigation.js';
import { initMobileGnb } from './components/gnb.js';
import { initFamilySite } from './components/family-site.js';
import { initTabs } from './components/tab.js';
import { initNewsletter } from './components/newsletter.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. 공통 레이아웃 기능 초기화
  initNavigation();
  initMobileGnb();
  initFamilySite();
  initTabs();
  initNewsletter();

  console.log('RMHC Portal template initialized successfully.');
});
