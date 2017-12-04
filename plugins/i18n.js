import Vue from 'vue'
import Vuex from 'vuex'
/**
 * TODO fetchLanguage, changeLanguage similar to examples in vuex-i18n/test
 * TODO translation keys at more info
 */
// load and register the vuex i18n module
// import vuexI18n from 'vuex-i18n'
import vuexI18n from 'vuex-i18n/dist/vuex-i18n.umd.js'

export default ({ req }) => {
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
  Vue.i18n.add('en', require('~/locales/en.json'))

  const userLocale = process.browser ? (navigator.language || navigator.userLanguage) : req.locale
  const availableLocales = ['de', 'en']
  const locale = (availableLocales.indexOf(userLocale) !== -1) ? userLocale : 'en'

  if (locale !== 'en') {
    Vue.i18n.add(locale, require(`~/locales/${locale}.json`))
  }

  // Set the start locale to use
  Vue.i18n.set(locale)
  Vue.i18n.fallback('en')

  return store
}
