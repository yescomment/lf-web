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
import ProductFilter from './product-filter';
// import TwitterFetcher from './twitter-fetcher';
import NewsFilters from './news-filter';
import EventsFilter from './events-filter';

Modal.init();
Nav.init();
Overlay.init();
// Scroll.init();
Search.init();
Utils.markdownLinksNewPage();

if (window.location.pathname.includes('/publications\/?')) {
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

if (window.location.pathname.match(/initiatives\/?$/gm)) {
  CustomDropdown.init();
}

if (window.location.pathname.match(/publications\/?$/gm)) {
  ProductFilter.init();
}

if (window.location.pathname.match(/blog\/?$/gm)) {
  NewsFilters.init();
}

if (window.location.pathname.match(/events\/?$/gm)) {
  EventsFilter.init();
}
// if (window.location.pathname === '/' || window.location.pathname === '/engelberg/') {
//   TwitterFetcher.init();
// }
