import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

if (process.browser) {
  Raven
    .config('https://b26378911a9f4d1fb0e83a418f6241e7@sentry.io/213871', {
      release: 'pre-alpha',
      environment: process.env.NODE_ENV,
      extra: {
        ssr: false
      }
    })
    .addPlugin(RavenVue, Vue)
    .install()
}
