const CustomDropdown = {
  createDropdown() {
    let i, j, ll, setEl, a, b, c;
    const x = document.getElementsByClassName('custom-select');
    const l = x.length;
    for (i = 0; i < l; i++) {
      setEl = x[i].getElementsByTagName('select')[0];
      ll = setEl.length;
      // For each element, create a new div that will act as the selected item
      a = document.createElement('div');
      a.setAttribute('class', 'select-selected');
      a.innerHTML = setEl.options[setEl.selectedIndex].innerHTML;
      x[i].appendChild(a);
      // For each element, create a new div that will contain the option list
      b = document.createElement('div');
      b.setAttribute('class', 'select-items select-hide');

      for (j = 1; j < ll; j++) {
        // For each option in the original select element, create a new div that will act as an option item
        c = document.createElement('div');
        c.innerHTML = setEl.options[j].innerHTML;
        c.setAttribute('url-value', setEl.options[j].value);
        c.setAttribute('class', 'dropdown-item');

        c.addEventListener('click', e => {
          let y, i, k, s, h, sl, yl;
          s = e.target.parentNode.parentNode.getElementsByTagName('select')[0];
          sl = s.length;
          h = e.target.parentNode.previousSibling;

          for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML === e.target.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = e.target.innerHTML;
              y = e.target.parentNode.getElementsByClassName('same-as-selected');
              yl = y.length;
              for (k = 0; k < yl; k++) {
                y[k].removeAttribute('class');
              }
              break;
            }
          }
          h.click();
          sessionStorage.setItem('dropdownItem', h.innerHTML);

          if (window.location.host.match(/objectively.github.io\/?$/gm)) {
            window.location.href = `/engelberg${e.target.getAttribute('url-value')}`;
          } else {
            window.location.href = `${e.target.getAttribute('url-value')}`;
          }
        });

        b.appendChild(c);
      }
      x[i].appendChild(b);

      a.addEventListener('click', e => {
        e.stopPropagation();
        CustomDropdown.closeAllSelect(e.target);
        e.target.nextSibling.classList.toggle('select-hide');
        e.target.classList.toggle('select-arrow-active');
      });
    }
  },
  closeAllSelect(el) {
    let i, arrNo = [];
    const x = document.getElementsByClassName('select-items');
    const y = document.getElementsByClassName('select-selected');
    const xl = x.length;
    const yl = y.length;
    for (i = 0; i < yl; i++) {
      if (el === y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove('select-arrow-active');
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add('select-hide');
      }
    }

    document.addEventListener('click', this.closeAllSelect);
  },
  init() {
    this.createDropdown();
  }
};

module.exports = CustomDropdown;
