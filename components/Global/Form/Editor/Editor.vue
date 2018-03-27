<template>
  <no-ssr>
    <div class="hc-editor-wrapper">
      <div :id="`toolbar-editor-${identifier}`" v-if="toolbar">
        <div class="ql-formats">
          <b-tooltip :label="$t('component.editor.italic')" type="is-black">
            <button class="ql-italic"></button>
          </b-tooltip>
          <b-tooltip :label="$t('component.editor.bold')" type="is-black">
            <button class="ql-bold"></button>
          </b-tooltip>
          <b-tooltip :label="$t('component.editor.strike')" type="is-black">
            <button class="ql-strike"></button>
          </b-tooltip>
        </div>
        <div class="ql-formats">
          <b-tooltip :label="$t('component.editor.blockquote')" type="is-black">
            <button class="ql-blockquote"></button>
          </b-tooltip>
        </div>
        <div class="ql-formats">
          <b-tooltip :label="$t('component.editor.listUnordered')" type="is-black">
            <button class="ql-list" value="bullet" ></button>
          </b-tooltip>
          <b-tooltip :label="$t('component.editor.listOrdered')" type="is-black">
            <button class="ql-list" value="ordered" ></button>
          </b-tooltip>
        </div>
        <div class="ql-formats">
          <b-tooltip :label="$t('component.editor.link')" type="is-black">
            <button class="ql-link"></button>
          </b-tooltip>
          <b-tooltip :label="$t('component.editor.video')" type="is-black">
            <button class="ql-video"></button>
          </b-tooltip>
        </div>
      </div>
      <div class="hc-editor-container">
        <div class="quill-editor" :class="editorClass"
          v-model="editorText"
          :disabled="loading"
          @blur="editorBlur()"
          @focus="editorFocus()"
          @ready="editorReady($event)"
          ref="content"
          v-quill:myQuillEditor="computedEditorOptions"></div>
        <div class="plugins" v-if="ready && myQuillBus">
          <editor-mentions :quill="myQuillBus" />
        </div>
      </div>
    </div>
  </no-ssr>
</template>

<script>
  import EditorMentions from '~/components/Mentions/EditorMentions'
  import Emitter from 'emitter-js'

  class QuillBus {
    constructor (quillEditor) {
      this.emitter = new Emitter()
      let bus = this
      this.getBounds = (index) => quillEditor.getBounds(index)
      this.updateContents = (ops) => quillEditor.updateContents(ops)
      this.setSelection = (index) => quillEditor.setSelection(index)
      quillEditor.on('text-change', (...args) => bus.emit('text-change', ...args))
      quillEditor.on('selection-change', (...args) => bus.emit('selection-change', ...args))
    }

    on (eventName, fn) {
      this.emitter.on(eventName, fn)
    }

    off (eventName, fn) {
      this.emitter.off(eventName, fn)
    }

    emit (eventName, ...args) {
      this.emitter.emit(eventName, ...args)
    }
  }

  export default {
    name: 'hc-editor',
    components: {
      EditorMentions
    },
    props: {
      value: {
        type: [String, Boolean],
        default: ''
      },
      loading: {
        type: Boolean,
        default: false
      },
      editorOptions: {
        type: Object,
        default: () => {}
      },
      editorClass: {
        type: String,
        default: 'story'
      },
      identifier: {
        type: [String],
        default: 'editor'
      }
    },
    data () {
      return {
        ready: false,
        editorText: '',
        focus: true,
        myQuillBus: false,
        defaultEditorOptions: {
          theme: 'snow',
          modules: {
            toolbar: {
              container: `#toolbar-editor-${this.identifier}`,
              handlers: {
              }
            },
            urlEmbeds: {
              metaApi: 'http://localhost:3050'
            }
          },
          placeholder: 'Schreiben ...'
        }
      }
    },
    computed: {
      computedEditorOptions () {
        let newOptions = { ...this.defaultEditorOptions, ...this.editorOptions }
        return newOptions
      },
      changes () {
        return this.editorText !== this.value
      },
      toolbar () {
        if (!this.computedEditorOptions.modules) {
          return false
        }
        return this.computedEditorOptions.modules.toolbar
      }
    },
    methods: {
      reset () {
        this.editorText = this.value
        this.$emit('reset')
      },
      editorBlur () {
        this.focus = false
      },
      editorFocus () {
        this.focus = true
      },
      editorReady () {
        this.myQuillBus = new QuillBus(this.myQuillEditor)
        this.ready = true
      },
      populateEmbeds (value) {
        const utils = require('quill-url-embeds').utils
        const populator = new utils.populator('http://localhost:3050')
        value = utils.anchorToEmbed(value)
        this.$nextTick(() => {
          populator.populate(this.$refs.content)
        })
        return value
      }
    },
    watch: {
      editorText (newText, oldText) {
        if (newText !== oldText) {
          this.$emit('input', newText)
        }
      },
      value (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.editorText = this.populateEmbeds(newValue)
        }
      }
    },
    created () {
      this.editorText = this.value
    },
    mounted () {
      this.editorText = this.populateEmbeds(this.value)
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/utilities";

  .hc-editor-container {
    position: relative;
  }

  .has-error,
  .is-danger {
    .quill-editor {
      border-color: $red !important;
    }
  }
</style>
