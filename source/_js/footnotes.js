const Footnotes = {
  iterateFootnotes() {
    document.querySelectorAll('sup').forEach((footnote, idx) => {
      footnote.innerText = idx + 1;
    });

    document.querySelectorAll('.footnote-numbers').forEach((footnote, idx) => {
      footnote.innerText = idx + 1;
    });
  },
  init() {
    this.iterateFootnotes();
  }
};

module.exports = Footnotes;