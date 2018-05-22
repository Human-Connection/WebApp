import Delta from 'quill-delta'
import Populator from './utils/populator'

const defaults = {
  // Only match single line urls
  urlRegex: /^https?:\/\/[\S]+$/gm
}

const urlEmbedBuilder = (initOptions) => {
  return class UrlEmbeds {
    constructor (quill, options) {
      this.quill = quill
      options = options || {}
      this.options = {...defaults, ...options}
      this.populator = new Populator(initOptions.metaApi, this.options.metaCallback)
      this.registerTypeListener()
      this.registerPasteListener()
      this.registerInitListener()
      this.userHasTyped = false
      window.addEventListener('keydown', () => {
        this.userHasTyped = true
      }, { once: true })
    }
    registerPasteListener () {
      this.quill.clipboard.addMatcher(Node.TEXT_NODE, (node, delta) => {
        if (typeof node.data !== 'string' || !this.userHasTyped) {
          return delta
        }
        const matches = node.data.match(this.options.urlRegex)
        if (matches && matches.length > 0) {
          setTimeout(() => {
            this.checkTextForUrl()
          }, 1)
        }
        return delta
      })
    }
    registerTypeListener () {
      this.quill.on('text-change', (delta, oldDelta, source) => {
        if (source === 'api' || !this.userHasTyped) {
          return
        }
        let ops = delta.ops
        // Only return true, if last operation includes whitespace inserts
        // Equivalent to listening for enter, tab or space
        if (!ops || ops.length < 1 || ops.length > 2) {
          return
        }
        let lastOp = ops[ops.length - 1]
        if (!lastOp.insert || typeof lastOp.insert !== 'string' || !lastOp.insert.match(/\s/)) {
          return
        }
        this.checkTextForUrl()
      })
    }
    registerInitListener () {
      this.quill.once('editor-change', () => {
        setTimeout(() => {
          this.populator.populate(this.quill.container.firstChild)
        }, 1)
      })
    }
    checkTextForUrl () {
      let sel = this.quill.getSelection()
      if (!sel) {
        return
      }
      let [line] = this.quill.getLine(sel.index)
      if (!line.domNode || !line.domNode.innerText) {
        return
      }
      const matches = line.domNode.innerText.match(this.options.urlRegex)
      if (!matches || !matches.length) {
        return
      }
      let stepsBack = line.domNode.innerText.length
      let index = sel.index - stepsBack
      this.textToUrl(index, matches[0])
    }
    async textToUrl (index, url) {
      const urlEmbed = await this.buildUrlEmbed(url)
      const ops = new Delta()
        .retain(index)
        .delete(url.length)
        .insert(urlEmbed)
      this.quill.updateContents(ops)
      setTimeout(() => {
        this.quill.setSelection(index + 1)
      }, 100)
    }
    buildUrlEmbed (url) {
      const embed = {
        urlEmbed: {
          url: url,
          html: url
        }
      }
      setTimeout(() => {
        this.populator.populate(this.quill.container.firstChild)
      }, 1)
      return embed
    }
  }
}

export default urlEmbedBuilder
