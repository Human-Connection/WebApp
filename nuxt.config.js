const path = require('path')

module.exports = {
  env: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 3000,
    API_HOST: process.env.API_HOST || 'localhost',
    API_PORT: process.env.API_PORT || 3030,
    SENTRY_DNS_PUBLIC: process.env.SENTRY_DNS_PUBLIC || 'https://b26378911a9f4d1fb0e83a418f6241e7@sentry.io/213871',
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN || 'pk.eyJ1IjoiaHVtYW4tY29ubmVjdGlvbiIsImEiOiJjajl0cnBubGoweTVlM3VwZ2lzNTNud3ZtIn0.KZ8KK9l70omjXbEkkbHGsQ',
    RELEASE: 'BUILD_RELEASE'
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
        '~/helpers': path.resolve(__dirname, 'helpers')
      })
      config.resolve.alias = aliases // eslint-disable-line no-param-reassign
      // Needed for some plugins that don't pre-compile templates
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    }
  },
  plugins: [
    {src: '~/plugins/debug.js', ssr: false},
    {src: '~/plugins/client-auth.js', ssr: false},
    {src: '~/plugins/raven-client.js', ssr: false},
    {src: '~/plugins/raven-server.js', ssr: true},
    {src: '~/plugins/feathers.js'},
    {src: '~/plugins/i18n.js'},
    {src: '~/plugins/init-store-subscriptions.js', ssr: false},
    {src: '~/plugins/buefy.js'},
    {src: '~/plugins/global-components.js', injectAs: 'globalComponents'},
    {src: '~/plugins/vue-clip.js', ssr: false},
    {src: '~/plugins/quill-editor.js'},
    {src: '~/plugins/v2-table.js', ssr: false}
  ],
  modules: [
    '@nuxtjs/webpackmonitor'
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
