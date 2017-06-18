export default function ({ store, redirect, route }) {
  if (!store.getters['auth/isAuthenticated']) {
    return redirect('/login', {
      redirect: route.path
    })
  }
}
