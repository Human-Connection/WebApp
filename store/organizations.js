import feathers from '~/plugins/feathers'

export const actions = {
  async patch ({dispatch}, organization) {
    if (!organization) {
      return null
    }
    console.log(organization)
    return feathers.service('organizations').patch(organization._id, organization)
  },
  create ({dispatch}, organization) {
    return feathers.service('organizations').create(organization)
  },
  follow ({dispatch}, userId, organizationId) {
    return feathers.service('follows').create({followingId: organizationId, type: 'organizations', userId: userId})
  }
}
