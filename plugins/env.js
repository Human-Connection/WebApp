import Vue from 'vue'

export default async (context) => {
  context.app.$env = context.env

  Vue.use({
    install (Vue, store) {
      Vue.prototype.$env = context.app.$env
    }
  }, context.store)

  return context.app.$env
}
