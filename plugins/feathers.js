import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
import io from 'socket.io-client'
import hooks from 'feathers-hooks'
import authentication from 'feathers-authentication-client'
import storage from '~helpers/ssr-storage'

const host = process.env.API_HOST || 'http://localhost'
const port = process.env.API_PORT || '3030'
const socket = io(`${host}:${port}`)

const app = feathers()
  .configure(socketio(socket))
  .configure(hooks())
  .configure(authentication({storage}))

export default app
