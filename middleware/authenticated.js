import { isEmpty } from 'lodash'

export default function ({ store, route, redirect }) {
  if (route.path.indexOf('/auth/login') !== 0 &&
      route.path.indexOf('/auth/register') !== 0 &&
      route.path.indexOf('/auth/signup') !== 0 &&
      route.path.indexOf('/auth/passwort-reset') !== 0 &&
      route.path.indexOf('/legal') !== 0 &&
      !store.getters['auth/isAuthenticated']) {
    // remove session cookies
    store.dispatch('auth/logout', null, { root: true })

    let params = {}
    if (!isEmpty(route.path) && route.path !== '/') {
      params.path = route.path
    }

    return redirect('/auth/login', params)
  }
}
