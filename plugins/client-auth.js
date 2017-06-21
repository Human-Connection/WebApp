import Vue from 'vue'

let init = false

if (process.BROWSER_BUILD) {
  const clientAuth = {}
  clientAuth.install = (Vue) => {
    Vue.mixin({
      async beforeMount () {
        // Reauthenticate after page reload
        // Only executes on client
        if (!init) {
          const accessToken = window.localStorage.getItem('feathers-jwt')
          if (accessToken) {
            await this.$store.dispatch('auth/jwt', {accessToken})
          }
        }
        init = true
      }
    })
  }
  Vue.use(clientAuth)
}
