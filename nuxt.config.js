require('dotenv').config()
const path = require('path')

module.exports = {
  env: {
    // pages which do not require a login
    publicPages: [
      'auth-login',
      'auth-register',
      'auth-signup',
      'auth-passwort-reset',
      'legal',
      'test'
    ],
    // Keep alive these pages
    // Examples:
    // pages/index -> index
    // pages/contributions/_slug -> contributions/Slug
    keepAlivePages: [
      'index'
    ]
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - Human Connection',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no'},
      {hid: 'description', name: 'description', content: 'Human Connection'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {rel: 'stylesheet', href: '//fonts.googleapis.com/icon?family=Material+Icons'}
    ]
  },
  /*
   ** Loader / Progress Bar
   */
  loading: {
    color: '#86b31e',
    height: '2px'
  },
  /*
   ** Global CSS
   *
   *  NOTE: Needed to add font-awesome and mapbox-gl here as otherwise
   *        we get issues with the styleguide after the nuxt update as they
   *        now use "~" alias for the srcDir instead of the node_modules
   *        like it would be the standard :-/
   */
  css: [
    'font-awesome/css/font-awesome.min.css',
    'mapbox-gl/dist/mapbox-gl.css',
    'assets/styles/main.scss',
    'quill/dist/quill.snow.css',
    'quill/dist/quill.core.css'
  ],
  build: {
    presets: ['vue-app'],
    vendor: [
      'moment',
      'bricks.js',
      'vuex-i18n',
      'mapbox-gl',
      // Feathers
      'feathers/client',
      'feathers-socketio/client',
      'socket.io-client',
      'feathers-hooks',
      'feathers-authentication-client'
    ],
    extend (config) {
      /*
       ** Run ESLINT on save
       */
      if (process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      // Add aliases
      const aliases = Object.assign(config.resolve.alias, {
        '~/helpers': path.resolve(__dirname, 'helpers')
      })
      config.resolve.alias = aliases // eslint-disable-line no-param-reassign
      // Needed for some plugins that don't pre-compile templates
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    }
  },
  plugins: [
    {src: '~/plugins/env.js'},
    {src: '~/plugins/debug.js', ssr: false},
    {src: '~/plugins/raven-client.js', ssr: false},
    {src: '~/plugins/api.js'},
    {src: '~/plugins/init-store-subscriptions.js', ssr: false},
    {src: '~/plugins/keep-alive.js', ssr: false},
    {src: '~/plugins/i18n.js'},
    {src: '~/plugins/buefy.js'},
    {src: '~/plugins/vue-clip.js', ssr: false},
    {src: '~/plugins/global-components.js'},
    {src: '~/plugins/quill/index.js', ssr: false},
    {src: '~/plugins/v2-table.js', ssr: false},
    {src: '~/plugins/scroll-to.js', ssr: false}
  ],
  modules: [
    'cookie-universal-nuxt',
    '@nuxtjs/dotenv'
    // '@nuxtjs/pwa'
  ],
  router: {
    middleware: [
      'maintenance',
      'check-auth',
      'authenticated'
    ],
    linkActiveClass: 'active-link'
  },
  manifest: {
    name: 'Human-Connection.org',
    description: 'Human-Connection.org',
    theme_color: '#ffffff',
    lang: 'de'
  }
}
