const { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } = require('node-html-markdown');

const FootnotesTest = {
  formatFootnote(footnote) {

    const fnNumber = footnote.id.replace('fn:', '');

    // create outer div
    const footnoteEl = document.createElement(`div`);
    footnoteEl.classList.add(`footnote-container`);
    footnoteEl.setAttribute('data-location', footnote.id);

    const footnoteLabel = document.createElement(`p`);
    footnoteLabel.classList.add(`footnote-numbers`);
    
    footnoteLabel.textContent = fnNumber; 

    footnoteEl.appendChild(footnoteLabel);

    footnoteEl.appendChild(footnote);
    return footnoteEl;

    // const footnoteHTML = `
    //   <div class="footnote-container" data-location="${footnote.id}">
    //     <div class="row">
    //       <div class="column large-1 small-1 medium-1">
    //         <p class="footnote-numbers">${fnNumber}</p>
    //       </div>
    //       <div class="column large-10 small-10 medium-10">
    //         <p><a href="https://www.si.edu/openaccess/faq">https://www.si.edu/openaccess/faq</a></p>
    //         ${innerHTML}
    //       </div>
    //     </div>
    //   </div>
    // `;

    // const footnoteEl = NodeHtmlMarkdown.translate(footnoteHTML);
    // debugger
    // return footnoteEl;
  },
  formatFootnoteLink(HTML) {
    // <sup tabindex="3" class="footnote" id="5kN3rxsCbg4GMJ1MXSwHra">
    //   1
    // </sup>;
  },
  init() {
    const allFootnoteLinks = document.querySelectorAll('sup[role="doc-noteref"]');
    Array.from(allFootnoteLinks).forEach(footnoteLink => {
      footnoteLink.classList.add('footnote');
      footnoteLink.textContent = footnoteLink.children[0].innerHTML;
    });

    // move markdown footnotes to slide panel
    Array.from(document.querySelector('.footnotes ol').children).map(footnote => {
      document.querySelector('.slide-panel__content').appendChild(this.formatFootnote(footnote));
    });
  }
};

module.exports = FootnotesTest;
