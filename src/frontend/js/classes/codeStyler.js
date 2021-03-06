import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import style from 'highlight.js/styles/github-gist.css';

/**
 * @class CodeStyles
 * @classdesc Provides styling for code blocks
 */
export default class CodeStyler {
  /**
   * @param {string} selector - CSS selector for code blocks
   * @param {string[]} languages - list of languages to highlight, see hljs.listLanguages()
   */
  constructor({selector, languages = [ 'javascript' ]}) {
    this.codeBlocksSelector = selector;
    this.languages = languages;
    this.langsAvailable = {
      javascript
    };

    this.init();
  }

  /**
   * Start to highlight
   */
  init() {
    const codeBlocks = document.querySelectorAll(this.codeBlocksSelector);

    if (!codeBlocks.length) {
      return;
    }

    this.languages.forEach(lang => {
      hljs.registerLanguage(lang, this.langsAvailable[lang]);
    });

    hljs.configure({
      languages: this.languages
    });

    Array.from(codeBlocks).forEach(block => {
      hljs.highlightBlock(block);
    });
  }
}
