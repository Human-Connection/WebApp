<template>
  <div class="hc-editor-mentions" v-if="bounds" :style="style">
    <editor-mentions-search :search-string="searchString"
      @itemselected="itemSelected" />
  </div>
</template>

<script>
  import Delta from 'quill-delta'
  import EditorMentionsSearch from '~/components/Mentions/Search'

  let offset = 10
  const lastLetterTyped = (delta, source) => {
    let ops = delta.ops
    let lastOp = ops[ops.length - 1]
    // Return false if user is not typing single characters
    if (!source === 'api' || !ops || ops.length < 1 || ops.length > 2 || !lastOp.insert || typeof lastOp.insert !== 'string') {
      return false
    }
    return lastOp.insert
  }

  const lastDeleteTyped = (delta, source) => {
    let ops = delta.ops
    let lastOp = ops[ops.length - 1]
    // Return false if user is not deleting single characters
    if (!source === 'api' || !ops || ops.length < 1 || ops.length > 2 || !lastOp.delete || !lastOp.delete === 1) {
      return false
    }
    return lastOp.delete
  }

  export default {
    name: 'hc-editor-mentions',
    components: {
      EditorMentionsSearch
    },
    props: {
      quill: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        searchActive: false,
        searchString: '',
        index: null,
        bounds: null,
        mentionListener: null
      }
    },
    computed: {
      style () {
        if (!this.bounds) return ''
        let left = this.bounds.left
        let top = this.bounds.top + this.bounds.height + offset
        return `left: ${left}px; top: ${top}px`
      }
    },
    mounted () {
      if (!this.mentionListener) {
        this.registerMentionListener()
      }
    },
    watch: {
      quill () {
        if (!this.mentionListener) {
          this.registerMentionListener()
        }
      }
    },
    methods: {
      registerMentionListener () {
        this.mentionListener = this.quill.on('text-change', (delta, oldDelta, source) => {
          let letter = lastLetterTyped(delta, source)
          // Only go on if last operation includes @
          if (!letter || !letter.match(/@/)) {
            return
          }
          this.startChangeListener()
        })
      },
      startChangeListener () {
        this.quill.on('text-change', this.changeListener)
        this.quill.on('selection-change', this.selectionListener)
      },
      stopChangeListener () {
        this.quill.off('selection-change', this.selectionListener)
        this.quill.off('text-change', this.changeListener)
        this.index = null
        this.bounds = null
        this.searchString = ''
        this.searchActive = false
      },
      changeListener (delta, oldDelta, source) {
        let letter = lastLetterTyped(delta, source)
        let deleteLetter = lastDeleteTyped(delta, source)
        // Stop if user did any other action then typing
        if (!letter && !deleteLetter) {
          this.stopChangeListener()
          return
        }
        // Stop if user deleted last letter
        if (deleteLetter && this.searchString.length < 1) {
          this.stopChangeListener()
          return
        }
        this.searchString = letter
          ? this.searchString + letter
          : this.searchString.slice(0, -1)
        // Stop if search contains at least two whitespaces in a row
        if (this.searchString.match(/\s{2,}/g)) {
          this.stopChangeListener()
          return
        }
        this.index = delta.ops[0].retain - this.searchString.length
        if (deleteLetter) {
          this.index--
        }
        this.searchActive = true
        this.bounds = this.quill.getBounds(this.index)
      },
      selectionListener (range) {
        // stop listening if user changed selection in editor
        if (range && this.searchActive) {
          this.stopChangeListener()
        }
      },
      itemSelected ({item}) {
        this.insertMention(item)
      },
      insertMention (item) {
        let deleteLength = this.searchString.length + 1 // + @
        // Save index, because it is going to be reset
        let index = this.index
        let name = item.name
        let _id = item._id
        let slug = item.slug
        const ops = new Delta()
          .retain(index)
          .delete(deleteLength)
          .insert(name, {mention: { _id, slug }})
          .insert(' ')
        this.stopChangeListener()
        this.quill.updateContents(ops)
        this.quill.setSelection(index + name.length + 1)
      }
    },
    beforeDestroy () {
      if (this.searchActive) {
        this.stopChangeListener()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .hc-editor-mentions {
    position: absolute;
    z-index: 100;
  }
</style>
