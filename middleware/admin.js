export default function ({ store, redirect }) {
  if (!store.getters['auth/isAdmin']) {
    return redirect('/')
  }
}
