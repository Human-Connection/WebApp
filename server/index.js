import { Builder, Nuxt } from 'nuxt'
import express from 'express'
import bodyParser from 'body-parser'
import expressHealthcheck from 'express-healthcheck'
// import helmet from 'helmet'
import createLocaleMiddleware from 'express-locale'
import cookieParser from 'cookie-parser'
import redirectSSL from 'redirect-ssl'
import avatar from './avatar'
import embeds from './embeds'
import raven from '../plugins/raven-server'

require('dotenv').config() // load .env into process.env

const app = express()

// Import and Set Nuxt.js options
let nuxtConfig = require('../nuxt.config.js')
nuxtConfig.dev = (process.env.NODE_ENV !== 'production')
nuxtConfig.debug = nuxtConfig.dev ? 'nuxt:*,app' : null

// Add middleware
app.use(redirectSSL)
// app.use(helmet())
app.use(cookieParser())
app.use(createLocaleMiddleware({
  priority: ['cookie', 'accept-language'],
  cookie: { name: 'locale' }
}))

// Must configure Raven before doing anything else with it
raven(app)

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/healthcheck', expressHealthcheck())
app.use('/avatar', avatar())
app.use('/embeds', embeds())

// Init Nuxt.js
const nuxt = new Nuxt(nuxtConfig)

app.set('port', process.env.WEBAPP_PORT)

// Build only in dev mode
if (nuxtConfig.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)
// Listen the server
app.listen(process.env.WEBAPP_PORT, process.env.WEBAPP_HOST)
console.log(`Server listening on ${process.env.WEBAPP_HOST}:${process.env.WEBAPP_PORT}`) // eslint-disable-line no-console
console.log(`MAINTENANCE ${(Boolean(process.env.MAINTENANCE) === true).toString()}`) // eslint-disable-line no-console
console.log(`WEBAPP_PORT ${process.env.WEBAPP_PORT}`) // eslint-disable-line no-console
console.log(`WEBAPP_HOST ${process.env.WEBAPP_HOST}`) // eslint-disable-line no-console
console.log(`WEBAPP_BASE_URL ${process.env.WEBAPP_BASE_URL}`) // eslint-disable-line no-console
console.log(`API_PORT ${process.env.API_PORT}`) // eslint-disable-line no-console
console.log(`API_HOST ${process.env.API_HOST}`) // eslint-disable-line no-console
