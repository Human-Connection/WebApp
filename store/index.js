export const strict = false

export const actions = {
  async nuxtServerInit ({dispatch}) {
    dispatch('categories/init')
    await dispatch('auth/init')
    await dispatch('settings/init')
  }
}
