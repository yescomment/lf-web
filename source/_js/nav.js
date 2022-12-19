const Nav = {
  mainMenu() {
    const mainNav = document.querySelector('.main-nav');
    const openNav = document.querySelector('.open-nav');

    openNav.addEventListener('click', () => {
      mainNav.classList.add('nav-active');
      document.querySelector('main').classList.add('main-active');
      document.querySelector('.top-bar').classList.add('nav-is-active');
    });

    const closeNav = () => {
      mainNav.classList.remove('nav-active');
      document.querySelector('main').classList.remove('main-active');
      document.querySelector('.top-bar').classList.remove('nav-is-active');
    };

    document.querySelector('.close-nav').addEventListener('click', () => {
      closeNav();
    });

    // Open and close nav on keydown event for accessibility
    openNav.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        mainNav.classList.add('nav-active');
        document.querySelector('main').classList.add('main-active');
      }
    });

    document.querySelector('.close-nav').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        closeNav();
      }
    });

    // Close open nav on body click
    window.addEventListener('click', e => {
      if (
        e.target !== mainNav &&
        e.target.parentNode !== mainNav &&
        e.target !== openNav &&
        e.target.parentNode !== openNav
      ) {
        closeNav();
      }
    });
  },
  init() {
    this.mainMenu();
  }
};

module.exports = Nav;
