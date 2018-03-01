import Vue from 'vue'

export default async (context) => {
  await context.store.dispatch('env/init', context)
  context.app.$env = context.store.getters['env/all']

  Vue.use({
    install (Vue, store) {
      Vue.prototype.$env = context.app.$env
    }
  }, context.store)

  return context.app.$env
}
