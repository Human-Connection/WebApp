import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
import io from 'socket.io-client'
import hooks from 'feathers-hooks'
import authentication from 'feathers-authentication-client'
import urlHelper from '~/helpers/urls'
import Vue from 'vue'

export default ({app, store, redirect, router}) => {
  const authKey = 'feathers-jwt'
  const endpoint = urlHelper.buildEndpointURL(app.$env.API_HOST, { port: app.$env.API_PORT })
  const storage = {
    getItem: (key) => {
      const res = app.$cookies.get(key)
      // console.log(`## STORAGE: getItem(${key})`, res)
      return res
    },
    setItem: (key, value, options) => {
      const res = app.$cookies.set(key, value, options)
      // console.log(`## STORAGE: setItem(${key}, ${value}, ${options})`, res)
      return res
    },
    removeItem: (key) => {
      const res = app.$cookies.remove(key)
      // console.log(`## STORAGE: removeItem(${key})`, res)
      return res
    },
    clear: () => {
      const res = app.$cookies.removeAll()
      if (process.env.NODE_ENV === 'development') {
        console.log(`## STORAGE: clear()`, res)
      }
      return res
    }
  }
  let api = feathers()
    .configure(socketio(io(endpoint, {
      timeout: 8000
    })))
    .configure(hooks())
    .configure(authentication({
      storage: storage,
      storageKey: authKey,
      cookie: authKey
    }))
  api.hooks({
    before: {
      all: [
        async (hook) => {
          // hook.accessToken = await api.passport.getJWT()
          if (process.env.NODE_ENV === 'development') {
            console.log('# API:', `${hook.method} ${hook.path}`)
            // console.log('# ' + hook.accessToken)
          }
          return hook
        }
      ]
    },
    async error (ctx) {
      if (process.env.NODE_ENV === 'development') {
        console.log('####################')
        console.error(ctx.error)
        console.info('JWT TOKEN: ', app.$cookies.get(authKey))
        console.info('path', ctx.path)
        console.info('service', ctx.service)
        console.info('method', ctx.method)
        console.info('params', ctx.params)
        console.info('id', ctx.id)
        console.info('data', ctx.data)
        console.log('####################')
      }

      // force re-login on 401 responses
      if (process.client && ctx.error.code === 401) {
        await store.dispatch('auth/logout')
        redirect(`/auth/login?path=${window.location.pathname}`)
      }
    }
  })

  /**
   * (Re-)Authenticate a user by credentials or jwt token
   *
   * returns the user object or null
   * @param {Object} options
   */
  api.auth = async (options = {strategy: 'jwt'}) => {
    // console.log('~~~######### api.auth', options)
    let user = null
    const response = await api.authenticate(options)
    const payload = await api.passport.verifyJWT(response.accessToken)
    if (payload.userId) {
      user = await api.service('users').get(payload.userId)
    }
    // api.set('user', user)
    return user
  }

  /**
   * @deprecated
   */
  api.authKey = authKey

  // make the api accessible inside vue components
  Vue.use({
    install (Vue) {
      Vue.prototype.$api = api
    }
  })

  // make the api accessible thrugh app.$api
  app.$api = api

  return api
}
