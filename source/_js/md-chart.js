const MdChart = {
  addToggle() {
    const tables = document.querySelectorAll('.table__body--chart');
    const htmlButtonString = `<button class="markdown-table-toggle"><i class="material-icons">expand_more</i>Show chart data</button>`;
    tables.forEach(item => {
      item.insertAdjacentHTML('beforebegin', htmlButtonString);
    });
  },
  toggleMdChart() {
    const buttons = document.querySelectorAll('.markdown-table-toggle');
    buttons.forEach(button => {
      button.addEventListener('click', e => {
        e.target.classList.toggle('active');
        const icon = e.target.querySelector('i');
        e.target.classList.contains('active') ? icon.innerHTML = 'expand_less' : icon.innerHTML = 'expand_more';

        const subsequentTable = e.target.nextSibling;
        subsequentTable.classList.toggle('active');
      });
    });
  },
  init() {
    this.addToggle();
    this.toggleMdChart();
  }
};

module.exports = MdChart;
