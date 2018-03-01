// import Vue from 'vue'

// let init = false

export default ({app, store}) => {
  // if (process.client) {
  //   const clientAuth = {}
  //   clientAuth.install = (Vue) => {
  //     Vue.mixin({
  //       async beforeCreate () {
  //         // Reauthenticate after page reload
  //         // Only executes on client
  //         if (!init) {
  //           const accessToken = app.$cookies.get(app.$api.authKey)
  //           if (accessToken) {
  //             // await store.dispatch('auth/jwt', {accessToken})
  //           }
  //         }
  //         init = true
  //       }
  //     })
  //   }
  //   Vue.use(clientAuth)
  // }
  return true
}
