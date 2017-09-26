export const actions = {
  nuxtServerInit ({dispatch}) {
    dispatch('categories/init')
  }
}

export const state = () => ({
  locales: ['de', 'en'],
  locale: 'en'
})

export const mutations = {
  SET_LANG (state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }
  }
}
