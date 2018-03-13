import { Builder, Nuxt } from 'nuxt'
import express from 'express'
import bodyParser from 'body-parser'
import expressHealthcheck from 'express-healthcheck'
// import helmet from 'helmet'
import createLocaleMiddleware from 'express-locale'
import cookieParser from 'cookie-parser'
import redirectSSL from 'redirect-ssl'
import avatar from './avatar'
import raven from '../plugins/raven-server'
import { readFileSync } from 'fs'

// Get .env config
require('dotenv').config()

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

// Init Nuxt.js
const nuxt = new Nuxt(nuxtConfig)

const env = require('dotenv').parse(readFileSync('./.env'))

app.set('port', env.WEBAPP_PORT)

// Build only in dev mode
if (nuxtConfig.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)
// Listen the server
app.listen(env.WEBAPP_PORT, env.WEBAPP_HOST)
console.log(`Server listening on ${env.WEBAPP_HOST}:${env.WEBAPP_PORT}`) // eslint-disable-line no-console
console.log(`WEBAPP_PORT ${env.WEBAPP_PORT}`) // eslint-disable-line no-console
console.log(`WEBAPP_HOST ${env.WEBAPP_HOST}`) // eslint-disable-line no-console
console.log(`WEBAPP_BASE_URL ${env.WEBAPP_BASE_URL}`) // eslint-disable-line no-console
console.log(`API_PORT ${env.API_PORT}`) // eslint-disable-line no-console
console.log(`API_HOST ${env.API_HOST}`) // eslint-disable-line no-console
