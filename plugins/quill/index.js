import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor/dist/ssr'
import { Quill } from 'vue-quill-editor'
import { urlEmbedModule, urlEmbed } from '~/modules/quill-url-embeds/index'
import Links from './links'
import Mentions from './mentions'

Quill.register({
  'blots/links': Links,
  'blots/mentions': Mentions,
  'blots/urlEmbed': urlEmbed,
  'modules/urlEmbeds': urlEmbedModule({
    metaApi: '/embeds'
  })
})
Vue.use(VueQuillEditor)
