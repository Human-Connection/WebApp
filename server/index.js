import { Builder, Nuxt } from 'nuxt'
import express from 'express'
import bodyParser from 'body-parser'
import expressHealthcheck from 'express-healthcheck'
import Raven from 'raven'
// import helmet from 'helmet'
import createLocaleMiddleware from 'express-locale'
import enforceHTTPS from '../middleware/enforce-https'

const app = express()
// app.use(helmet())

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

if (process.server) {
  // LOGGING IS ENABLED
  console.log('SENTRY LOGGING IS ENABLED')

  // Must configure Raven before doing anything else with it
  Raven.config('https://b26378911a9f4d1fb0e83a418f6241e7@sentry.io/213871', {
    release: process.env.RELEASE,
    environment: process.env.NODE_ENV,
    extra: {
      ssr: true
    }
  }).install()

  // The request handler must be the first middleware on the app
  app.use(Raven.requestHandler())
  // The error handler must be before any other error middleware
  app.use(Raven.errorHandler())
}

// enforce ssl connection if the BASE_URL beginns with https://
if (process.env.BASE_URL && process.env.BASE_URL.indexOf('https://') === 0) {
  app.use(enforceHTTPS())
}

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(createLocaleMiddleware({
  default: 'de_DE'
}))

app.use('/healthcheck', expressHealthcheck())

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
