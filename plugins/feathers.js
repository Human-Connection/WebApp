import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
import io from 'socket.io-client'
import hooks from 'feathers-hooks'
import authentication from 'feathers-authentication-client'
import storage from '~/helpers/ssr-storage'

let endpoint = process.env.API_HOST
if (endpoint.indexOf('http') !== 0) {
  endpoint = 'http://' + process.env.API_HOST
}
if (process.env.API_PORT > 0 && (process.env.API_PORT !== 443 || process.env.API_PORT !== 80)) {
  endpoint += ':' + process.env.API_PORT
}
console.log('API SOCKET ENDPOINT: ' + endpoint)
const api = feathers()
  .configure(socketio(io(endpoint)))
  .configure(hooks())
  .configure(authentication({storage}))

export default api
