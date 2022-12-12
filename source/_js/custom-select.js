const CustomDropdown = {
  createDropdown() {
    let i, j, ll, setEl, a, b, c;
    const x = document.getElementsByClassName('custom-select');
    const l = x.length;

    function createOption(e) {
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

      let targetValue = e.target.getAttribute('url-value');
      const allDropdownItems = document.querySelectorAll('.dropdown-item');
      const dropdownArray = Array.prototype.slice.call(allDropdownItems);

      function selectRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
      }

      if (targetValue === 'random-select') {
        targetValue = selectRandom(dropdownArray).getAttribute('url-value');
      }

      if (window.location.host.match(/objectively.github.io\/?$/gm)) {
        window.location.href = `/engelberg${targetValue}`;
      } else {
        window.location.href = `${targetValue}`;
      }
    }

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
        if (setEl.options[j].value !== 'random-select') {
          c.setAttribute('class', 'dropdown-item');
        }
        c.setAttribute('tabindex', '0');

        c.addEventListener('click', e => {
          createOption(e);
        });

        c.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            createOption(e);
          }
        });

        b.appendChild(c);
      }
      x[i].appendChild(b);

      a.addEventListener('click', e => {
        e.stopPropagation();
        CustomDropdown.closeAllSelect(e.target);
        e.target.nextSibling.classList.toggle('select-hide');
      });

      a.parentElement.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const selectItemsContainer = document.querySelector('.select-items').classList.contains('select-hide');
          e.stopPropagation();
          CustomDropdown.closeAllSelect(e.target);
          if (selectItemsContainer) {
            document.querySelector('.select-items').classList.remove('select-hide');
          } else {
            document.querySelector('.select-items').classList.add('select-hide');
          }
        }
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
