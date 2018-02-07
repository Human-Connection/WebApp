<template>
  <div class="hc-editor-wrapper">
    <div :id="`toolbar-editor-${identifier}`">
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
      <div class="quill-editor story"
         v-model="editorText"
         :disabled="loading"
         @blur="editorBlur()"
         @focus="editorFocus()"
         @ready="editorReady($event)"
         v-quill:myQuillEditor="computedEditorOptions"></div>
       <div class="plugins" v-if="ready && myQuillEditor">
         <editor-mentions :quill="myQuillEditor" />
       </div>
    </div>
  </div>
</template>

<script>
  import EditorMentions from '~/components/Mentions/EditorMentions'

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
        defaultEditorOptions: {
          theme: 'snow',
          modules: {
            toolbar: {
              container: `#toolbar-editor-${this.identifier}`,
              handlers: {
              }
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
        this.ready = true
      }
    },
    watch: {
      editorText (newText) {
        if (newText !== this.text) {
          this.$emit('input', newText)
        }
      }
    },
    created () {
      this.editorText = this.value
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/utilities";

  .hc-editor-container {
    position: relative;
  }
</style>
