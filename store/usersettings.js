export const actions = {
  async patch ({dispatch}, usersettings) {
    if (!usersettings) {
      return null
    }
    return this.app.$api.service('usersettings').patch(usersettings._id, usersettings)
  }
}
