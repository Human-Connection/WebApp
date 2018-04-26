import { Quill } from 'vue-quill-editor'
import { buildUserUrl } from '~/helpers/urls'
let EmbedBlot = Quill.import('blots/embed')

const dataIdentifier = 'data-hc-mention'
const mentionClass = 'hc-editor-mention-blot'
class MentionBlot extends EmbedBlot {
  static create (item) {
    let node = super.create()
    let url = buildUserUrl(item.slug)
    node.setAttribute('href', url)
    node.setAttribute('class', mentionClass)
    node.setAttribute(dataIdentifier, JSON.stringify(item))
    node.insertAdjacentHTML('beforeend', item.name)
    return node
  }

  static value (node) {
    return JSON.parse(node.getAttribute(dataIdentifier))
  }
}
MentionBlot.blotName = 'mention'
MentionBlot.className = 'mention'
MentionBlot.tagName = 'a'

export default MentionBlot
