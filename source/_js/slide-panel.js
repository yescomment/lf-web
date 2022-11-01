const SlidePanel = {
  currentFootnote: 0,
  openPanel: () => {
    const footnotes = document.querySelectorAll('.footnote');
    const slidePanel = document.querySelector('.slide-panel');
    const overlay = document.querySelector('#overlay');

    Array.prototype.slice.call(footnotes).forEach(footnote => {
      footnote.addEventListener('click', () => {
        SlidePanel.currentFootnote = footnote.id;
        SlidePanel.scrollToFootnoteInsidePanel(footnote.id);
        slidePanel.classList.add('slide-panel--is-visible');
        overlay.classList.add('js-active');
      });

      footnote.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          SlidePanel.scrollToFootnoteInsidePanel(footnote.id);
          slidePanel.classList.add('slide-panel--is-visible');
          overlay.classList.add('js-active');
        }
      });
    });
  },
  scrollToFootnoteInsidePanel: id => {
    const footnotes = document.querySelectorAll('.footnote-container');
    footnotes.forEach(footnote => {
      const foonotePosition = footnote.offsetTop;

      if (footnote.getAttribute('data-location') === id) {
        footnote.classList.add('active-footnote');
        $('.slide-panel__container').animate({ scrollTop: foonotePosition }, 200);
      } else {
        footnote.classList.remove('active-footnote');
      }
    });
  },
  closePanel: () => {
    const slidePanel = document.querySelector('.slide-panel');
    const closeButton = document.querySelector('.close-panel');
    const overlay = document.querySelector('#overlay');

    overlay.addEventListener('click', () => {
      slidePanel.classList.remove('slide-panel--is-visible');
    });

    closeButton.addEventListener('click', () => {
      slidePanel.classList.remove('slide-panel--is-visible');
    });
  },
  windowResize: () => {
    // Keep active footnote at top of panel on window resize
    window.addEventListener('resize', () => {
      SlidePanel.scrollToFootnoteInsidePanel(SlidePanel.currentFootnote);
    });
  },
  init() {
    this.openPanel();
    this.closePanel();
    this.windowResize();
  }
};

module.exports = SlidePanel;
