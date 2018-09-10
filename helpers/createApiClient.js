import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'
import authentication from '@feathersjs/authentication-client'
import urlHelper from '~/helpers/urls'
import Cookie from 'cookie-universal'

const authKey = 'feathers-jwt'
const endpoint = urlHelper.buildEndpointURL(process.env.API_HOST, { port: process.env.API_PORT })
let socket
if (process.env.ENV === 'production') {
  socket = socketio(io(endpoint), { timeout: 20000 })
  if (process.server) {
    setTimeout(() => {
      // close server connection as content was delivered already after 30 seconds at latest
      try {
        socket.close()
      } catch (err) {
        console.log(err)
      }
    }, 30000)
  }
} else {
  socket = socketio(io(endpoint))
}

let createApiClient = ({req, res}) => {
  const cookies = Cookie(req, res)
  const storageMapping = {
    getItem: (key) => {
      const res = cookies.get(key)
      // console.log(`## STORAGE: getItem(${key})`, res)
      return res
    },
    setItem: (key, value, options) => {
      const res = cookies.set(key, value, options)
      // console.log(`## STORAGE: setItem(${key}, ${value}, ${options})`, res)
      return res
    },
    removeItem: (key) => {
      const res = cookies.remove(key)
      // console.log(`## STORAGE: removeItem(${key})`, res)
      return res
    },
    clear: () => {
      const res = cookies.removeAll()
      if (process.env.NODE_ENV === 'development') {
        console.log(`## STORAGE: clear()`, res)
      }
      return res
    }
  }

  let api = feathers()
    .configure(socket)
    .configure(authentication({
      storage: storageMapping,
      storageKey: authKey,
      cookie: authKey
    }))

  return api
}

export default createApiClient
