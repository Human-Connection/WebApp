import Vue from 'vue'

if (process.browser) {
  Vue.use(require('vue-quill-editor/dist/ssr'))
}
