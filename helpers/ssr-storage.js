import cookie from 'js-cookie'

const expires = 365

export default {
  getItem (key) {
    let result = cookie.get(key)
    if (!result && process.browser) {
      window.localStorage.getItem(key)
    }
    return result
  },
  setItem (key, value) {
    cookie.set(key, value, {expires})
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
