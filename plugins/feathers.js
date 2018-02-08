import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
import io from 'socket.io-client'
import hooks from 'feathers-hooks'
import authentication from 'feathers-authentication-client'
import storage from '~/helpers/ssr-storage'
import urlHelper from '~/helpers/urls'

const endpoint = urlHelper.buildEndpointURL(process.env.API_HOST, { port: process.env.API_PORT })
const api = feathers()
  .configure(socketio(io(endpoint)))
  .configure(hooks())
  .configure(authentication({storage}))

api.hooks({
  error (ctx) {
    // TODO: output a nice message to the user before throwing them out
    // console.error(ctx.error)
    // console.error(storage.getItem('feathers-jwt'))
    // console.info('path', ctx.path)
    // console.info('service', ctx.service)
    // console.info('method', ctx.method)
    // console.info('params', ctx.params)
    // console.info('id', ctx.id)
    // console.info('data', ctx.data)
    if (process.client && ctx.error.code === 401) {
      // TODO: use the vuex store to logout the user
      // TODO: try to save current form inputs for after login (if not already done)
      // console.log('### LOGOUT AND REDIRECT TO LOGIN')
      storage.removeItem('feathers-jwt')
      storage.removeItem('io')
      api.logout()
      let loginUrl = '/auth/login?path=' + window.location.pathname
      window.location = loginUrl
    }
  }
})

export default api
