import Vue from 'vue'
import Buefy from 'buefy'

if (process.BROWSER_BUILD) {
  Vue.use(Buefy)
}
