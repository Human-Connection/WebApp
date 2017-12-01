import Vue from 'vue'
import Vuex from 'vuex'
/**
 * TODO fetchLanguage, changeLanguage similar to examples in vuex-i18n/test
 * TODO translation keys at more info
 */
// load and register the vuex i18n module
// import vuexI18n from 'vuex-i18n'
import vuexI18n from 'vuex-i18n/dist/vuex-i18n.umd.js'

import english from '~/locales/en.json'
import german from '~/locales/de.json'

const doDebug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  strict: doDebug
})

Vue.use(
  vuexI18n.plugin,
  store,
  {
    onTranslationNotFound: function (locale, key) {
      console.warn(`vuex-i18n :: Key '${key}' not found for locale '${locale}'`)
    }
  })

// register the locales
Vue.i18n.add('en', english)
Vue.i18n.add('de', german)

// Set the start locale to use
Vue.i18n.set('de')
Vue.i18n.fallback('de')

export default store
