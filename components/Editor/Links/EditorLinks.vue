<template>
  <div class="hc-editor-links" v-if="bounds" :style="style">
    <div class="hc-editor-popup">
      <form @submit.prevent="insert()">
        <div class="field">
          <div class="control">
            <input
              class="input"
              id="hc-editor-link-input"
              v-model="url"
              @blur="close()"
              type="text"
              v-bind:placeholder="$t('component.editor.linkPlaceholder')"
              ref="input">
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  let offset = 10

  export default {
    name: 'hc-editor-links',
    props: {
      quill: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        bounds: null,
        url: null,
        text: null
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
        this.url = null
        this.text = null
      },
      open () {
        let range = this.quill.getSelection()
        if (!range || !range.length) {
          return
        }
        this.text = this.quill.getText(range.index, range.length)
        this.bounds = this.quill.getBounds(range.index)
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      },
      insert () {
        let url = this.url
        this.close()
        this.quill.format('link', url)
      }
    },
    beforeDestroy () {
      this.close()
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-editor-links {
    position: absolute;
    z-index: 100;

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
</style>
