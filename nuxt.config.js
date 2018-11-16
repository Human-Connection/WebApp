const path = require('path')
const envWhitelist = [
  'BUILD_COMMIT',
  'NODE_ENV',
  'WEBAPP_HOST',
  'WEBAPP_PORT',
  'WEBAPP_BASE_URL',
  'API_HOST',
  'API_PORT',
  'EMBED_API_URL',
  'SENTRY_DNS_PUBLIC',
  'MAPBOX_TOKEN',
  'MAINTENANCE'
]

module.exports = {
  env: {
    // pages which do not require a login
    publicPages: [
      'auth-login',
      'auth-register',
      'auth-signup',
      'auth-reset',
      'auth-reset-token',
      'pages-slug',
      'test'
    ],
    // pages to keep alive
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
    height: '2px',
    duration: 20000
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
    'assets/styles/main.scss'
  ],
  build: {
    presets: ['vue-app'],
    vendor: [
      'moment',
      'bricks.js',
      'vuex-i18n',
      'mapbox-gl',
      // Feathers
      '@feathersjs/feathers',
      '@feathersjs/client',
      '@feathersjs/socketio-client',
      'socket.io-client',
      '@feathersjs/authentication-client'
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
      // Mapbox-gl throws error after being uglified
      // https://github.com/mapbox/mapbox-gl-js/issues/4359
      config.module.noParse = /(mapbox-gl)\.js$/
    }
  },
  plugins: [
    {src: '~/plugins/debug.js', ssr: false},
    {src: '~/plugins/raven-client.js', ssr: false},
    {src: '~/plugins/api.js'},
    {src: '~/plugins/init-feathers-vuex.js'},
    {src: '~/plugins/vue-directives.js', ssr: false},
    {src: '~/plugins/init-store-subscriptions.js', ssr: false},
    {src: '~/plugins/keep-alive.js', ssr: false},
    {src: '~/plugins/clipboard.js', ssr: false},
    {src: '~/plugins/i18n.js'},
    {src: '~/plugins/buefy.js'},
    {src: '~/plugins/vue-clip.js', ssr: false},
    {src: '~/plugins/global-components.js'},
    {src: '~/plugins/quill/index.js', ssr: false},
    {src: '~/plugins/v2-table.js', ssr: false},
    {src: '~/plugins/scroll-to.js', ssr: false},
    {src: '~/plugins/affix.js', ssr: false},
    {src: '~/plugins/open-page-in-modal.js', ssr: false}
  ],
  modules: [
    ['@nuxtjs/dotenv', { only: envWhitelist }],
    ['nuxt-env', { keys: envWhitelist }],
    'cookie-universal-nuxt'
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
