import { Nuxt, Builder } from 'nuxt'
import express from 'express'
import bodyParser from 'body-parser'
import expressHealthcheck from 'express-healthcheck'

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/healthcheck', expressHealthcheck())

  // Import and Set Nuxt.js options
  let config = require('../nuxt.config.js')
  config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
  const nuxt = new Nuxt(config)

  app.set('port', config.env.PORT)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
  app.use(nuxt.render)
  // Listen the server
  app.listen(config.env.PORT, config.env.HOST)
  console.log('Server listening on ' + config.env.HOST + ':' + config.env.PORT) // eslint-disable-line no-console
