import { isEmpty } from 'lodash'

export default async ({ store, route, redirect }) => {
  // only affect non public pages
  if ((process.env.publicPages || []).indexOf(route.name) >= 0) {
    return true
  }
  // await store.dispatch('auth/refreshJWT', 'authendicated middleware')
  const isAuthenticated = await store.dispatch('auth/checkAuth')
  if (isAuthenticated) {
    return true
  }

  // try to logout user
  // await store.dispatch('auth/logout', null, { root: true })

  // set the redirect path for after the login
  let params = {}
  if (!isEmpty(route.path) && route.path !== '/') {
    params.path = route.path
  }

  return redirect('/auth/login', params)
}
