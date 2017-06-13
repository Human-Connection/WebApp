const path = require('path')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: ['~assets/css/main.css'],
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
    {src: '~plugins/feathers.js', injectAs: 'feathers'}
  ],
  router: {
    middleware: ['ssr-cookie']
  },
  modules: [
    '@nuxtjs/bulma',
    '@nuxtjs/font-awesome'
  ]
}
