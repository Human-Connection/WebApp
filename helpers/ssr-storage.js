import cookie from 'js-cookie'

export default {
  getItem (key) {
    let result = cookie.get(key)
    if (!result && process.browser) {
      window.localStorage.getItem(key)
    }
    return result
  },
  setItem (key, value, options = { expires: 365 }) {
    cookie.set(key, value, options)
    if (process.browser) {
      window.localStorage.setItem(key, value)
    }
  },
  removeItem (key) {
    cookie.remove(key)
    if (process.browser) {
      window.localStorage.removeItem(key)
    }
  }
}
