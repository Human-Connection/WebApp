import Vue from 'vue'
import Vuex from 'vuex'
import { debounce, isEmpty } from 'lodash'

import vuexI18n from 'vuex-i18n/dist/vuex-i18n.umd.js'

export default ({ app, req, cookie, store }) => {
  const doDebug = process.env.NODE_ENV !== 'production'
  const key = 'locale'

  const changeHandler = debounce((mutation, store) => {
    if (process.server) return

    const currentLocale = app.$cookies.get(mutation.payload.locale)
    console.log('store', store)
    const user = store.getters['auth/user']
    const token = store.getters['auth/token']
    // persist language if it differs from last value
    if (user && user._id && token && mutation.payload.locale !== currentLocale) {
      console.log(store)
      console.log('TRY TO SET THE LANGAUGE')
      store.dispatch('auth/patch', {
        language: mutation.payload.locale
      }, { root: true })
      app.$cookies.set(key, mutation.payload.locale)
    }
  }, 500)

  const i18nStore = new Vuex.Store({
    strict: doDebug
  })

  Vue.use(
    vuexI18n.plugin,
    i18nStore,
    {
      onTranslationNotFound: function (locale, key) {
        console.warn(`vuex-i18n :: Key '${key}' not found for locale '${locale}'`)
      }
    })

  // register the locales
  Vue.i18n.add('en', require('~/locales/en.json'))

  let userLocale = 'en'
  const localeCookie = app.$cookies.get(key)
  const user = store.getters['auth/user']
  console.log('USER::::')

  console.log(user)
  if (user && user.language) {
    console.log('+++ if (user && user.language)')
    // try to get saved user preference
    userLocale = user.language
  } else if (!isEmpty(localeCookie)) {
    console.log('+++ } else if (!isEmpty(localeCookie))')
    userLocale = localeCookie
  } else {
    console.log('+++')
    userLocale = process.browser ? (navigator.language || navigator.userLanguage) : req.locale
    if (userLocale && !isEmpty(userLocale.language)) {
      userLocale = userLocale.language.substr(0, 2)
    }
    // console.log('GET REQUEST LANGUAGE', userLocale)
  }

  const availableLocales = ['de', 'en']
  const locale = (availableLocales.indexOf(userLocale) >= 0) ? userLocale : 'en'

  if (locale !== 'en') {
    Vue.i18n.add(locale, require(`~/locales/${locale}.json`))
  }

  console.log('USER LOCALE: ', userLocale)
  console.log('LOCALE: ', locale)

  // Set the start locale to use
  Vue.i18n.set(locale)
  Vue.i18n.fallback('en')

  if (process.client) {
    i18nStore.subscribe((mutation, s) => {
      if (mutation.type === 'i18n/SET_LOCALE') {
        changeHandler(mutation, store)
      }
    })
  }

  return i18nStore
}
