<template>
  <div class="hc-editor-emojis" v-if="bounds" :style="style">
    <div class="hc-editor-popup" v-click-outside="close">
      <emoji-chooser @choose="insert" />
    </div>
  </div>
</template>

<script>
  let offset = 10
  import EmojiChooser from '~/components/Editor/Emojis/Chooser'
  import Delta from 'quill-delta'

  export default {
    name: 'hc-editor-emojis',
    components: {
      EmojiChooser
    },
    props: {
      quill: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        bounds: null,
        index: null,
        length: null
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
    methods: {
      toggle () {
        if (this.bounds) {
          this.close()
          return
        }
        this.open()
      },
      close () {
        this.bounds = null
        this.index = null
        this.length = null
      },
      open () {
        let range = this.quill.getSelection()
        if (!range) {
          return
        }
        this.index = range.index
        this.length = range.length
        this.bounds = this.quill.getBounds(range.index)
      },
      insert (emoji) {
        let string = emoji.string
        const ops = new Delta()
          .retain(this.index)
          .delete(this.length)
          .insert(string, {emoji})
          .insert(' ')
        this.quill.updateContents(ops)
        this.quill.setSelection(this.index + string.length + 1)
        this.close()
      }
    },
    beforeDestroy () {
      this.close()
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-editor-emojis {
    position: absolute;
    z-index: 30;

    .input {
      border: 0;
    }
  }

  .hc-editor-popup {
    position: relative;
    width:340px;
    background-color: $white;
    box-shadow: $card-shadow-hover;
    border: 1px solid $border;
    border-radius: $radius-large;
    min-height: 40px;
    padding: 5px;
  }

  .hc-editor-popup-focus {
    display: block;
    opacity: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
  }
</style>
