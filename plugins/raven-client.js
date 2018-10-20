import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

export default ({app}) => {
  if (process.browser && app.$env.SENTRY_DNS_PUBLIC) {
    Raven
      .config(app.$env.SENTRY_DNS_PUBLIC, {
        release: app.$env.BUILD_COMMIT,
        environment: app.$env.NODE_ENV,
        tags: {
          client: true
        }
      })
      .addPlugin(RavenVue, Vue)
      .install()
  }
}
