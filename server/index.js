import Nuxt from 'nuxt'
import express from 'express'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Start nuxt.js
async function start () {
  // Import and Set Nuxt.js options
  let config = require('../nuxt.config.js')
  config.dev = !(process.env.NODE_ENV === 'production')
  // Instanciate nuxt.js
  const nuxt = new Nuxt(config)

  app.set('port', config.env.PORT)

  // Add nuxt.js middleware
  app.use(nuxt.render)
  // Listen the server
  app.listen(config.env.PORT, config.env.HOST)
  console.log('Server listening on ' + config.env.HOST + ':' + config.env.PORT) // eslint-disable-line no-console
}

start()
