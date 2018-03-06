import feathers from '~/plugins/feathers'

export const actions = {
  async patch ({dispatch}, organization) {
    if (!organization) {
      return null
    }
    return feathers.service('organizations').patch(organization._id, organization)
  },
  create ({dispatch}, organization) {
    return feathers.service('organizations').create(organization)
  },
  follow ({dispatch}, data) {
    return feathers.service('follows').create({followingId: data.organizationId, type: 'organizations', userId: data.currentUserId})
  }
}
