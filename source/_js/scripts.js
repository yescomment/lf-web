import FixedNav from './fixed-nav';
import Overlay from './overlay';
import Modal from './modal';
import Nav from './nav';
import Scroll from './scroll';
import SlidePanel from './slide-panel';
import Search from './search';
import Utils from './utils';
import CustomDropdown from './custom-select';
import Footnotes from './footnotes';
import ProductFilters from './product-list';
import TwitterFetcher from './twitter-fetcher';

Modal.init();
Nav.init();
Overlay.init();
// Scroll.init();
Search.init();
Utils.markdownLinksNewPage();

if (window.location.pathname.includes('/products/')) {
  if (document.querySelector('.product-page')) {
    Footnotes.init();
    FixedNav.init();
    SlidePanel.init();

    // Insert div inside blockquote to create left border
    document.querySelectorAll('blockquote').forEach(item => {
      if (!item.classList.contains('pull-quote')) {
        item.insertAdjacentHTML('afterbegin', '<div class="border">');
      }
    });
  }
}

if (window.location.pathname === '/what-we-do/' || window.location.pathname === '/for-students/') {
  CustomDropdown.init();
}

if (window.location.pathname === '/engelberg/what-we-do/' || window.location.pathname === '/engelberg/for-students/') {
  CustomDropdown.init();
}

if (window.location.pathname.match(/products\/?$/gm)) {
  ProductFilters.init();
};

if (window.location.pathname === '/' || window.location.pathname === '/engelberg/') {
  TwitterFetcher.init();
}
