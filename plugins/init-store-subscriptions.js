import Vue from 'vue'

let init = false

if (process.browser) {
  const clientAuth = {}
  clientAuth.install = (Vue) => {
    Vue.mixin({
      async beforeMount () {
        // Dispatch store subscriptions exactly once
        if (!init) {
          this.$store.dispatch('categories/subscribe')
          this.$store.dispatch('newsfeed/subscribe')
          this.$store.dispatch('notifications/subscribe')
          this.$store.dispatch('settings/subscribe')
        }
        init = true
      }
    })
  }
  Vue.use(clientAuth)
}
