export default function ({ store, redirect, route }) {
  if (!store.getters['auth/isVerified']) {
    return redirect('/')
  }
}
