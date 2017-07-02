const path = require('path')

module.exports = {
  env: {
    baseURL: process.env.BASE_URL || 'http://localhost',
    HOST: process.env.HOST || 'http://localhost',
    PORT: process.env.PORT || 3000,
    API_HOST: process.env.API_HOST || 'http://localhost',
    API_PORT: process.env.API_PORT || 3030
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - Human Connection',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Human Connection'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {rel: 'link', reql: 'stylesheet', href: '//fonts.googleapis.com/icon?family=Material+Icons'}
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
   */
  css: [
    '~assets/styles/main.scss',
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css'
  ],
  /*
   ** Add axios globally
   */
  build: {
    vendor: [
      'axios',
      'moment',
      'lodash',
      'bricks.js',
      // Feathers
      'feathers/client',
      'feathers-socketio/client',
      'socket.io-client',
      'feathers-hooks',
      'feathers-authentication-client'
    ],
    extend (config, ctx) {
      /*
       ** Run ESLINT on save
       */
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      // Add aliases
      const aliases = Object.assign(config.resolve.alias, {
        '~helpers': path.resolve(__dirname, 'helpers')
      })
      config.resolve.alias = aliases // eslint-disable-line no-param-reassign
    }
  },
  plugins: [
    {src: '~plugins/buefy.js'},
    {src: '~plugins/client-auth.js', ssr: false},
    {src: '~plugins/vue-clip.js'},
    {src: '~plugins/quill-editor.js'},
    {src: '~plugins/feathers.js', injectAs: 'feathers'}
  ],
  router: {
    middleware: ['check-auth'],
    linkActiveClass: 'active-link'
  }
}
