import Nuxt from 'nuxt'
import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'

import api from './api'
import oauth from './oauth'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// Sessions to create req.session
app.use(session({
  secret: 'super-secret-key',
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 60000}
}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.set('port', port)

// Import API Routes
app.use('/api', api)

// Import oAuth Routes
app.use(oauth)

// Start nuxt.js
async function start () {
  // Import and Set Nuxt.js options
  let config = require('../nuxt.config.js')
  config.dev = !(process.env.NODE_ENV === 'production')
  // Instanciate nuxt.js
  const nuxt = new Nuxt(config)
  // Add nuxt.js middleware
  app.use(nuxt.render)
  // Listen the server
  app.listen(port, host)
  console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
}

start()
