import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor/dist/ssr'
import { Quill } from 'vue-quill-editor'
import Parchment from 'parchment'
import { urlEmbed, urlEmbedModule } from 'quill-url-embeds'
import Mentions from './mentions'
Quill.register(Mentions)
Quill.register({
  'blots/urlEmbed': urlEmbed,
  'modules/urlEmbeds': urlEmbedModule
})
Parchment.register(urlEmbed)
Vue.use(VueQuillEditor)
