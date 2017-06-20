import cookie from 'js-cookie'

const expires = 365

export default {
  getItem (key) {
    let result = cookie.get(key)
    if (!result && process.BROWSER_BUILD) {
      window.localStorage.getItem(key)
    }
    return result
  },
  setItem (key, value) {
    console.log('#Try to set cookie ' + key)
    console.log('#VALUE: ' + value)
    cookie.set(key, value, {expires})
    if (process.BROWSER_BUILD) {
      window.localStorage.setItem(key, value)
    }
  },
  removeItem (key) {
    cookie.remove(key)
    if (process.BROWSER_BUILD) {
      window.localStorage.removeItem(key)
    }
  }
}
