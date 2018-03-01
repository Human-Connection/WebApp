export const actions = {
  async nuxtServerInit ({dispatch}) {
    dispatch('categories/init')
    await dispatch('auth/init')
  }
}
