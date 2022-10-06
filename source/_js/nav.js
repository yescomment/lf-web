const Nav = {
  mainNav: document.querySelector('.main-nav'),
  overlay: document.getElementById('overlay'),
  closeButton: document.querySelector('.close-button'),
  topBar: document.querySelector('.top-bar'),
  openMenu() {
    document.querySelector('.js-trigger-menu').addEventListener('click', () => {
      Nav.mainNav.classList.add('js-active-menu');
      Nav.overlay.classList.add('js-active');
      Nav.topBar.classList.add('full-width');
      Nav.overlay.style.zIndex = 1;
    });

    Nav.topBar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        Nav.mainNav.classList.add('js-active-menu');
        Nav.overlay.classList.add('js-active');
        Nav.topBar.classList.add('full-width');
      }
    });
  },
  closeMenu() {
    Nav.closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      Nav.topBar.classList.remove('full-width');
      Nav.mainNav.classList.remove('js-active-menu');
      Nav.overlay.classList.remove('js-active');
    });

    Nav.overlay.addEventListener('click', () => {
      Nav.topBar.classList.remove('full-width');
    });
  },
  hideNavOnScroll() {
    const hasFixedNav = document.querySelector('.page-section--nav');

    if (hasFixedNav) {
      const topSectionPosition = $('.top-section').position().top + $('.top-section').outerHeight();
      const topBarButton = $('.top-bar__menu-button');

      window.addEventListener('scroll', () => {
        if (topBarButton.offset().top > topSectionPosition - 55) {
          topBarButton.addClass('below-topbar')
        } else {
          topBarButton.removeClass('below-topbar')
        }
      });
    }
  },
  init() {
    this.openMenu();
    this.closeMenu();
    this.hideNavOnScroll();
  },
};

module.exports = Nav;
