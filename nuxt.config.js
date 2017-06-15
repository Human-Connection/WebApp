const path = require('path')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Human Connection',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Human Connection' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'link', reql: 'stylesheet', href: '//fonts.googleapis.com/icon?family=Material+Icons' }
    ]
  },
  /*
  ** Global CSS
  */
  css: ['~assets/styles/main.scss'],
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
    { src: '~plugins/buefy.js', ssr: false },
    { src: '~plugins/vueClip.js', ssr: false },
    {src: '~plugins/feathers.js', injectAs: 'feathers'}
  ],
  router: {
    middleware: ['check-auth'],
    linkActiveClass: 'active-link'
  }
}
