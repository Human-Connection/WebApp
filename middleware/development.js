export default function ({ isDev, redirect }) {
  if (!isDev) {
    return redirect('/')
  }
}
