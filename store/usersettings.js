import feathers from '~/plugins/feathers'

export const actions = {
  async patch ({dispatch}, usersettings) {
    if (!usersettings) {
      return null
    }
    return feathers.service('usersettings').patch(usersettings._id, usersettings)
  }
}
