import Vue from 'vue'

let vueClip

if (process.browser) {
  vueClip = require('vue-clip')
  Vue.use(vueClip)
}

export default vueClip
