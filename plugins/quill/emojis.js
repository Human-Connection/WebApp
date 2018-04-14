import { Quill } from 'vue-quill-editor'
let InlineBlot = Quill.import('blots/inline')

const dataIdentifier = 'data-hc-emoji'
const emojiClass = 'hc-editor-emoji-blot'
class EmojiBlot extends InlineBlot {
  static create (data) {
    let node = super.create()
    node.setAttribute('class', emojiClass)
    node.setAttribute(dataIdentifier, JSON.stringify(data))
    return node
  }
  static value (node) {
    return JSON.parse(node.getAttribute(dataIdentifier))
  }
  static formats () {
    return true
  }
}
EmojiBlot.blotName = 'emoji'
EmojiBlot.className = 'emoji'
EmojiBlot.tagName = 'span'

export default EmojiBlot
