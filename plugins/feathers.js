import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
import io from 'socket.io-client'
import hooks from 'feathers-hooks'
import authentication from 'feathers-authentication-client'
import storage from '~helpers/ssr-storage'

const endpoint = 'http://' + process.env.API_HOST + ':' + process.env.API_PORT
const api = feathers()
  .configure(socketio(io(endpoint)))
  .configure(hooks())
  .configure(authentication({storage}))

export default api
