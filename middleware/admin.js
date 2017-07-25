export default function ({ store, redirect, route }) {
  if (!store.getters['auth/isAdmin']) {
    return redirect('/')
  }
}
