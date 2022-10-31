const FixedNav = {
  fixNav: () => {
    const $window = $(window);
    const sidePanelContainer = document.querySelector('.slide-panel__container');
    const sidePanel = document.querySelector('.slide-panel');

    const setPanels = topElement => {
      sidePanelContainer.classList.add('fixed-panel', 'large-3', 'medium-12', 'small-12');

      if ($window.scrollTop() < topElement) {
        if (document.body.scrollWidth > 1023) {
          sidePanelContainer.classList.remove('fixed-panel', 'large-3');
          sidePanel.classList.remove('slide-panel--from-bottom');
          sidePanel.classList.add('slide-panel--from-right');
        } else {
          sidePanel.classList.remove('slide-panel--from-right');
          sidePanel.classList.add('slide-panel--from-bottom');
        }
      } else {
        if (document.body.scrollWidth < 1023) {
          sidePanel.classList.remove('slide-panel--from-right');
          sidePanel.classList.add('slide-panel--from-bottom');
        } else {
          sidePanel.classList.add('slide-panel--from-right');
          sidePanel.classList.remove('slide-panel--from-bottom');
        }
      }
    };

    if (document.querySelector('.fixed-nav')) {
      // FixedNav.toggleContentsPanel();
      // FixedNav.populateSectionLinks();
      // FixedNav.scrollToSection();

      const $fixedNav = $('.fixed-nav');
      const elTop = $fixedNav.offset().top;

      $window.scroll(() => {
        $fixedNav.toggleClass('fixed', $window.scrollTop() > elTop - 40);
        setPanels(elTop - 40);
      });

      window.addEventListener('resize', () => {
        setPanels(elTop - 40);
      });
    } else {
      const headerBottomPosition = $('.product-header').position().top + $('.product-header').outerHeight(true);

      $window.scroll(() => {
        if ($window.scrollTop() > (headerBottomPosition - 70)) {
          setPanels($('.product-header').outerHeight());
          document.querySelector('.slide-panel__container').style.marginTop = '70px';
        } else {
          setPanels($('.product-header').outerHeight());
          document.querySelector('.slide-panel__container').style.marginTop = '0';
        }
      });
    }
  },
  init() {
    this.fixNav();
  }
};

module.exports = FixedNav;
