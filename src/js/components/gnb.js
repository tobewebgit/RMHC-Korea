/**
 * 공통 GNB, 모바일 메뉴, 스크롤 헤더 제어 모듈
 */
export function initMobileGnb() {
  const header = document.querySelector('.header');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileMenuPanel = document.querySelector('.mobile-menu-panel');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mGnbTriggers = document.querySelectorAll('.m-gnb-trigger');

  if (header) {
    initHeaderScroll(header);
    initDesktopGnb(header);
  }

  if (!mobileNavToggle && !mobileMenuPanel && mGnbTriggers.length === 0) return;

  const syncTriggerState = (item, isActive) => {
    const trigger = item.querySelector('.m-gnb-trigger');
    if (trigger) {
      trigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    }
  };

  const setActiveMobileItem = (targetItem) => {
    const allItems = document.querySelectorAll('.m-gnb-item');
    allItems.forEach((item) => {
      const isActive = item === targetItem;
      item.classList.toggle('active', isActive);
      syncTriggerState(item, isActive);
    });
  };

  const setInitialMobileItem = () => {
    const currentPath = window.location.pathname;
    const items = Array.from(document.querySelectorAll('.m-gnb-item'));
    const matchedItem = items.find((item) =>
      Array.from(item.querySelectorAll('a')).some((link) => {
        const href = link.getAttribute('href');
        return href && currentPath.includes(href.replace(/^\//, '').replace(/\.html$/, ''));
      })
    );

    setActiveMobileItem(matchedItem || items[0]);
  };

  const toggleMobileMenu = (isOpen) => {
    if (!mobileMenuPanel) return;

    const shouldOpen =
      typeof isOpen === 'boolean'
        ? isOpen
        : !mobileMenuPanel.classList.contains('active');

    mobileMenuPanel.classList.toggle('active', shouldOpen);
    if (mobileMenuOverlay) mobileMenuOverlay.classList.toggle('active', shouldOpen);
    if (mobileNavToggle) {
      mobileNavToggle.classList.toggle('active', shouldOpen);
      mobileNavToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      mobileNavToggle.setAttribute('aria-label', shouldOpen ? '메뉴 닫기' : '메뉴 열기');
    }
    document.body.classList.toggle('menu-open', shouldOpen);
    mobileMenuPanel.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');

    if (shouldOpen) {
      setInitialMobileItem();
    }
  };

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => toggleMobileMenu());
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => toggleMobileMenu(false));
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', () => toggleMobileMenu(false));
  }

  mGnbTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      const parentItem = event.currentTarget.closest('.m-gnb-item');
      if (!parentItem) return;

      const isActive = parentItem.classList.contains('active');
      if (isActive) {
        parentItem.classList.remove('active');
        syncTriggerState(parentItem, false);
      } else {
        setActiveMobileItem(parentItem);
      }
    });
  });
}

function initHeaderScroll(header) {
  let lastScrollY = window.scrollY;
  const headerHeight = header.offsetHeight || 100;
  const scrollDelta = 6;
  let ticking = false;

  const updateHeader = () => {
    const currentScrollY = window.scrollY;
    const diff = currentScrollY - lastScrollY;

    if (currentScrollY <= 0) {
      header.classList.remove('is-scrolled', 'is-hidden', 'is-visible');
      lastScrollY = currentScrollY;
      return;
    }

    header.classList.add('is-scrolled');

    if (Math.abs(diff) < scrollDelta) {
      return;
    }

    if (diff > 0 && currentScrollY > headerHeight) {
      header.classList.add('is-hidden');
      header.classList.remove('is-visible');
    } else if (diff < 0) {
      header.classList.remove('is-hidden');
      header.classList.add('is-visible');
    }

    lastScrollY = currentScrollY;
  };

  updateHeader();
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    },
    { passive: true }
  );
}

function initDesktopGnb(header) {
  const navItems = header.querySelectorAll('.header__nav-item-wrap');
  const submenuPanel = header.querySelector('.header__submenu-panel');
  const submenuItems = header.querySelectorAll('.header__submenu');
  if (navItems.length === 0) return;
  let closeTimer = null;

  const closeAll = () => {
    navItems.forEach((item) => item.classList.remove('is-active'));
    submenuItems.forEach((item) => item.classList.remove('is-active'));
    header.classList.remove('is-gnb-open');
    if (submenuPanel) {
      submenuPanel.setAttribute('aria-hidden', 'true');
    }
  };

  const clearCloseTimer = () => {
    if (!closeTimer) return;
    clearTimeout(closeTimer);
    closeTimer = null;
  };

  const openItem = (targetItem) => {
    clearCloseTimer();
    const targetKey = targetItem.dataset.gnbMenu;

    header.classList.add('is-gnb-open');
    if (submenuPanel) {
      submenuPanel.setAttribute('aria-hidden', 'false');
    }

    navItems.forEach((item) => {
      item.classList.toggle('is-active', item === targetItem);
    });

    submenuItems.forEach((item) => {
      item.classList.toggle('is-active', item.dataset.gnbPanel === targetKey);
    });
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer = setTimeout(closeAll, 150);
  };

  navItems.forEach((item) => {
    item.addEventListener('mouseenter', () => openItem(item));
    item.addEventListener('focusin', () => openItem(item));
  });

  header.addEventListener('mouseenter', clearCloseTimer);
  header.addEventListener('mouseleave', scheduleClose);
  header.addEventListener('focusout', (event) => {
    if (!header.contains(event.relatedTarget)) {
      scheduleClose();
    }
  });

  if (submenuPanel) {
    submenuPanel.addEventListener('mouseenter', clearCloseTimer);
    submenuPanel.addEventListener('mouseleave', scheduleClose);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      clearCloseTimer();
      closeAll();
    }
  });
}
