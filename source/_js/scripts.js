import FixedNav from './fixed-nav';
import Overlay from './overlay';
import Modal from './modal';
import Nav from './nav';
import Scroll from './scroll';
import SlidePanel from './slide-panel';
import Search from './search';
import Utils from './utils';
import CustomDropdown from './custom-select';

Modal.init();
Nav.init();
Overlay.init();
// Scroll.init();
Search.init();
Utils.markdownLinksNewPage();

if (window.location.pathname === '/product/') {
  FixedNav.init();
  SlidePanel.init();
}

if (window.location.pathname === '/what-we-do/' || window.location.pathname === '/for-students/') {
  CustomDropdown.init();
}
