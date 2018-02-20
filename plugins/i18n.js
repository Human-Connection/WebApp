import Vue from 'vue'
import Vuex from 'vuex'
import { debounce, isEmpty } from 'lodash'

import vuexI18n from 'vuex-i18n/dist/vuex-i18n.umd.js'
import ssrStorage from '~/helpers/ssr-storage'

export default ({ req, cookie, store }) => {
  const doDebug = process.env.NODE_ENV !== 'production'
  const key = 'locale'
  const user = store.getters['auth/user']

  const changeHandler = debounce((mutation, state, store) => {
    let user = store.getters['auth/user']
    // persist language if it differs from last value
    if (user && user._id && mutation.payload.locale) {
      store.dispatch('auth/patch', {
        language: mutation.payload.locale
      }).catch()
    }
    ssrStorage.setItem(key, mutation.payload.locale)
  }, 500)

  const i18nStore = new Vuex.Store({
    strict: doDebug
  })
  i18nStore.subscribe((mutation, state) => {
    if (mutation.type === 'i18n/SET_LOCALE') {
      changeHandler(mutation, state, store)
    }
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
  const localeCookie = ssrStorage.getItem(key)

  if (user && user.language) {
    // try to get saved user preference
    userLocale = user.language
    // console.log('GET USER LANGUAGE', userLocale)
  } else if (!isEmpty(localeCookie)) {
    userLocale = localeCookie
    // console.log('GET COOKIE LANGUAGE', userLocale)
  } else {
    userLocale = process.browser ? (navigator.language || navigator.userLanguage) : req.locale
    if (!isEmpty(userLocale.language)) {
      userLocale = userLocale.language.substr(0, 2)
    }
    // console.log('GET REQUEST LANGUAGE', userLocale)
  }

  const availableLocales = ['de', 'en']
  const locale = (availableLocales.indexOf(userLocale) >= 0) ? userLocale : 'en'

  if (locale !== 'en') {
    Vue.i18n.add(locale, require(`~/locales/${locale}.json`))
  }

  // Set the start locale to use
  Vue.i18n.set(locale)
  Vue.i18n.fallback('en')

  return i18nStore
}
