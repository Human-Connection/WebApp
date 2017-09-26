export default function ({ isHMR, app, store, route, params, error, redirect }) {
  // If middleware is called from hot module replacement, ignore it
  if (isHMR) return
  // Get locale from params
  const locale = params.lang || 'de'
  if (store.state.locales.indexOf(locale) === -1) {
    return error({ message: 'This locale page could not be found.', statusCode: 404 })
  }
  // Set locale
  store.commit('SET_LANG', locale)
  app.i18n.locale = store.state.locale
  // If route is /de/... -> redirect to /...
  // if (locale === 'de' && route.fullPath.indexOf('/de') === 0) {
  //   return redirect(route.fullPath.replace(/^\/de/, '/'))
  //  }
}
