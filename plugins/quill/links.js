import { Quill } from 'vue-quill-editor'
let InlineBlot = Quill.import('blots/inline')

class LinkBlot extends InlineBlot {
  static create (url) {
    let node = super.create()
    node.setAttribute('href', url)
    node.setAttribute('class', 'hc-editor-link-blot')
    node.setAttribute('target', '_blank')
    return node
  }

  static value (node) {
    return node.getAttribute('href')
  }
}
LinkBlot.blotName = 'link'
LinkBlot.className = 'link'
LinkBlot.tagName = 'a'

export default LinkBlot
