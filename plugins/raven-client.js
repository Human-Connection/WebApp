import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

export default ({env}) => {
  if (process.browser && env.SENTRY_DNS_PUBLIC) {
    Raven
      .config(env.SENTRY_DNS_PUBLIC, {
        release: env.BUILD_DATE,
        environment: env.NODE_ENV,
        tags: {
          deployed: env.DEPLOY_DATE,
          client: true
        }
      })
      .addPlugin(RavenVue, Vue)
      .install()
  }
}
