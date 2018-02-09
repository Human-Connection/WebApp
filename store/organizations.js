import feathers from '~/plugins/feathers'

export const actions = {
  async patch ({dispatch}, organization) {
    if (!organization) {
      return null
    }
    return feathers.service('organizations').patch(organization._id, organization)
  }
}
