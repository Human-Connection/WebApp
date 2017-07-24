import Vue from 'vue'

let vueClip

if (process.BROWSER_BUILD) {
  vueClip = require('vue-clip')
  Vue.use(vueClip)
}

export default vueClip
