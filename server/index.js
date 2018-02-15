import { Builder, Nuxt } from 'nuxt'
import express from 'express'
import request from 'request'
import bodyParser from 'body-parser'
import expressHealthcheck from 'express-healthcheck'
import Raven from 'raven'
// import helmet from 'helmet'
import createLocaleMiddleware from 'express-locale'
import cookieParser from 'cookie-parser'
import redirectSSL from 'redirect-ssl'

const app = express()

// Add middleware
app.use(redirectSSL)
// app.use(helmet())
app.use(cookieParser())
app.use(createLocaleMiddleware({
  priority: ['cookie', 'accept-language'],
  cookie: { name: 'locale' }
}))

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

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/healthcheck', expressHealthcheck())
app.use('/avatar', (req, res) => {
  return new Promise((resolve, reject) => {
    request(`https://avataaars.io${req.url}`, (err, result, body) => {
      if (err) {
        console.error(err)
        res.status(err.statusCode || 500).send(err.message)
        reject()
      } else {
        console.log(result)
        res.status(200).header('Content-Type', 'image/svg+xml').send(body)
        resolve()
      }
    })
  })
})

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
