<template>
  <div class="hc-editor-embeds" v-if="bounds" :style="style" v-click-outside="close">
    {{ $t('component.editor.embedInsert') }}
  </div>
</template>

<script>
  let offset = 10
  import Delta from 'quill-delta'

  export default {
    name: 'hc-editor-embeds',
    props: {
      quill: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        bounds: null,
        index: null
      }
    },
    computed: {
      style () {
        if (!this.bounds) return ''
        let left = this.bounds.left
        let top = this.bounds.top - 2
        return `left: ${left}px; top: ${top}px`
      }
    },
    methods: {
      toggle () {
        if (this.bounds) {
          return
        }
        this.open()
      },
      close () {
        this.bounds = null
        this.index = null
        this.quill.off('text-change', this.close)
        this.quill.off('selection-change', this.close)
      },
      open () {
        let range = this.quill.getSelection()
        if (!range) {
          return
        }
        this.index = range.index
        let line = this.quill.getLine(range.index)
        const ops = new Delta()
          .retain(range.index)
        if (line[0].cache.length > 1) {
          ops.insert('\n')
        }
        if (range.index === 0) {
          ops.insert(' ')
        }
        if (line[1] && line[0].cache.length > line[1] + 1) {
          ops.insert('\n')
        }
        if (line[1]) {
          this.index++
        }
        this.quill.updateContents(ops)
        this.quill.setSelection(this.index)
        this.bounds = this.quill.getBounds(this.index)
        this.quill.on('text-change', this.close)
        this.quill.on('selection-change', this.close)
      }
    },
    beforeDestroy () {
      this.close()
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-editor-embeds {
    position: absolute;
    z-index: 30;
    color: $grey-light;

    .input {
      border: 0;
    }
  }
</style>
