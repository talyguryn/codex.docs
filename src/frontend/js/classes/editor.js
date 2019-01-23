import CodeXEditor from 'codex.editor';
import Header from 'codex.editor.header';
import InlineCode from 'codex.editor.inline-code';
import Marker from 'codex.editor.marker';
import List from 'codex.editor.list';
import Image from 'codex.editor.image';
import Delimiter from 'codex.editor.delimiter';

/**
 * Class for working with Editor.js
 */
export default class Editor {
  /**
   * Creates Editor instance
   * @property {object} initialData - data to start with
   */
  constructor({initialData}) {
    this.editor = new CodeXEditor({
      autofocus: true,

      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'Enter a title'
          }
        },

        image: {
          class: Image,
          config: {
            endpoints: {
              byFile: '/uploadImage',
              byUrl: '/uploadImageByURL',
            }
          }
        },

        list: {
          class: List,
          inlineToolbar: true
        },

        delimiter: Delimiter,

        inlineCode: {
          class: InlineCode
        },

        Marker: {
          class: Marker
        },
      },
      data: initialData || {
        blocks: [
          {
            type: 'header',
            data: {
              text: '',
              level: 2
            }
          },
          {
            type: 'paragraph',
            data: {}
          }
        ]
      }
    });
  }

  /**
   * Return Editor data
   * @return {Promise.<{}>}
   */
  save() {
    return this.editor.saver.save();
  }
}
