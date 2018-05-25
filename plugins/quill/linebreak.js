import { Quill } from 'vue-quill-editor'
let EmbedBlot = Quill.import('blots/embed')

class BreakBlot extends EmbedBlot {
  static create () {
    let node = super.create()
    node.insertAdjacentHTML('beforeend', '<br />')
    return node
  }
}
BreakBlot.blotName = 'linebreak'
BreakBlot.className = 'linebreak'
BreakBlot.tagName = 'span'

export default BreakBlot
