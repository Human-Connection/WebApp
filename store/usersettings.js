export const actions = {
  async patch ({dispatch, rootGetters}, data) {
    const user = rootGetters['auth/user']
    const userSettings = rootGetters['auth/userSettings']

    if (!user || !userSettings) {
      return null
    }
    data.userId = user._id.toString()

    const res = await this.app.$api.service('usersettings').create(data)
    await dispatch('auth/refreshUser', res, { root: true })

    return res
  }
}
