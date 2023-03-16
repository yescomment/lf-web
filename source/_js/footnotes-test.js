const FootnotesTest = {
  formatFootnote(location, innerHTML) {
    const fnNumber = location.replace('fn:', '');
    const footnoteEl = document.createElement(`div.footnote-container`);
    footnoteEl.setAttribute('data-location', location);
    footnoteEl.innerHTML = `
      <div class="row">
        <div class="column large-1 small-1 medium-1">
          <p class="footnote-numbers">${fnNumber}</p>
        </div>
        <div class="column large-10 small-10 medium-10">${innerHTML}</div>
      </div>
    `;
    return footnoteEl;
    // return `
    //   <div class="footnote-container" data-location="${location}"><div class="row"><div class="column large-1 small-1 medium-1"><p class="footnote-numbers">1</p></div><div class="column large-10 small-10 medium-10">${innerHTML}</div></div></div>
    // `;
  },
  formatFootnoteLink(HTML) {
    // <sup tabindex="3" class="footnote" id="5kN3rxsCbg4GMJ1MXSwHra">
    //   1
    // </sup>;
  },
  init() {
    let allFootnoteLinks = document.querySelectorAll('sup[role="doc-noteref"]');
    Array.from(allFootnoteLinks).forEach(footnoteLink => {
      footnoteLink.classList.add('footnote');
      footnoteLink.textContent = footnoteLink.children[0].innerHTML;
      // footnoteLink.innerHTML = '';
      // debugger
      // debugger;
      // return
    });

    // move markdown footnotes to slide panel

    Array.from(document.querySelector('.footnotes ol').children).map(footnote => {
      let location = footnote.id;
      let innerHTML = footnote.innerHTML;
      document.querySelector('.slide-panel__content').append(this.formatFootnote(location, innerHTML));
    });
    // document.querySelector('.slide-panel__content').append allFootnotes;
  }
};

module.exports = FootnotesTest;
