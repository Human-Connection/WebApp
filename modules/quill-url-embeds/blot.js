const Quill = require('quill')
const BlockEmbed = Quill.import('blots/block/embed')

class UrlEmbed extends BlockEmbed {
  static create ({url, html}) {
    let node = super.create()
    node.setAttribute('data-url-embed', url)
    node.setAttribute('contenteditable', 'false')
    node.insertAdjacentHTML('beforeend', html)
    return node
  }

  static value (node) {
    return node.getAttribute('data-url-embed')
  }
}
UrlEmbed.blotName = 'urlEmbed'
UrlEmbed.className = 'url-embed'
UrlEmbed.tagName = 'div'

export default UrlEmbed
