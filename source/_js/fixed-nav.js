const FixedNav = {
  fixNav: () => {
    const $window = $(window);
    const sidePanelContainer = document.querySelector('.slide-panel__container');
    const sidePanel = document.querySelector('.slide-panel');

    const setPanels = topElement => {
      sidePanelContainer.classList.add('fixed-panel', 'large-4', 'medium-12', 'small-12');

      if ($window.scrollTop() < topElement) {
        if (document.body.scrollWidth > 1023) {
          sidePanelContainer.classList.remove('fixed-panel', 'large-4');
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
      FixedNav.toggleContentsPanel();
      FixedNav.populateSectionLinks();
      FixedNav.scrollToSection();

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
  toggleContentsPanel() {
    const fixedNav = document.querySelector('.fixed-nav');
    fixedNav.addEventListener('click', e => {
      e.preventDefault();
      fixedNav.classList.toggle('active-nav');

      const $window = $(window);
      const $fixedNav = $('.fixed-nav');
      const elTop = $fixedNav.offset().top;

      if ($window.scrollTop() < elTop - 80) {
        $('html, body').animate({ scrollTop: elTop - 20 }, 'smooth');
      }

      if (fixedNav.classList.contains('active-nav')) {
        setTimeout(() => {
          document.querySelector('.sections-panel').classList.add('sections-panel--is-visible');
          document.querySelector('.section-link-column').style.display = 'block';
          document.querySelector('#overlay').classList.add('js-active');
          document.querySelector('body').classList.add('noscroll');
        }, 300);
      } else {
        document.querySelector('.section-link-column').style.display = 'none';
        document.querySelector('.sections-panel').classList.remove('sections-panel--is-visible');
        document.querySelector('#overlay').classList.remove('js-active');
        document.querySelector('body').classList.remove('noscroll');
      }
    });
  },
  scrollToSection() {
    function getLocationAndScroll(item) {
      const clickedSectionId = item.getAttribute('data-section');
      const topOfSection = document.getElementById(clickedSectionId).getBoundingClientRect().top + window.pageYOffset;

      window.scroll({
        top: topOfSection - 140,
        behavior: 'smooth'
      });
    }

    document.querySelectorAll('.content-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('.sections-panel').classList.remove('sections-panel--is-visible');
        getLocationAndScroll(link);
      });

      link.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          document.querySelector('.sections-panel').classList.toggle('sections-panel--is-visible');
          getLocationAndScroll(link);
        }
      });
    });
  },
  populateSectionLinks() {
    const headers = document.querySelectorAll('.heading');
    const sectionLinkColumn = document.querySelector('.section-link-column');
    const valueArray = [];
    let counter = 0;

    headers.forEach(header => {
      if (header.tagName === 'H2' || header.tagName === 'H3' || header.tagName === 'H4') {
        const link = document.createElement('a');
        if (!valueArray.includes(header.innerHTML)) {
          valueArray.push(header.innerHTML);
        } else {
          counter++;
          header.id = header.id + counter;
        }

        link.value = header.innerHTML;
        link.text = header.innerHTML;
        link.setAttribute('data-section', header.id);
        link.tabIndex = 0;

        switch (header.tagName) {
          case 'H3':
            link.setAttribute('class', 'content-link content-link--h3');
            break;
          case 'H4':
            link.setAttribute('class', 'content-link content-link--h4');
            break;
          default:
            link.setAttribute('class', 'content-link');
        }

        sectionLinkColumn.appendChild(link);
      }
    });
  },
  init() {
    this.fixNav();
  }
};

module.exports = FixedNav;
