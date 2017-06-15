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
  plugins: [
    { src: '~plugins/buefy.js', ssr: false },
    { src: '~plugins/vueClip.js', ssr: false }
  ],
  /*
  ** Global CSS
  */
  css: ['~assets/styles/main.scss'],
  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios', 'moment', 'lodash', 'bricks.js'],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  router: {
    middleware: ['ssr-cookie'],
    linkActiveClass: 'active-link'
  }
}
