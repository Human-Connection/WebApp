import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor/dist/ssr'
import { Quill } from 'vue-quill-editor'
import Mentions from './mentions'
Quill.register(Mentions)
Vue.use(VueQuillEditor)
