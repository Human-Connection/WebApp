import { isEmpty } from 'lodash'
import storage from '~/helpers/ssr-storage'

export default function ({ store, route, redirect }) {
  if (route.path.indexOf('/auth') !== 0 &&
      route.path.indexOf('/legal') !== 0 &&
      !store.getters['auth/isAuthenticated']) {
    // remove session cookies
    storage.removeItem('feathers-jwt')
    storage.removeItem('io')

    return redirect('/auth/login', {
      path: (!isEmpty(route.path) && route.path !== '/auth/login') ? route.path : null
    })
  }
}
