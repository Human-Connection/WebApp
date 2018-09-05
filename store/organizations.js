export default {
  namespaced: true,
  actions: {
    async patch ({dispatch}, organization) {
      if (!organization) {
        return null
      }
      return this.app.$api.service('organizations').patch(organization._id, organization)
    },
    create ({dispatch}, organization) {
      return this.app.$api.service('organizations').create(organization)
    },
    follow ({dispatch}, data) {
      return this.app.$api.service('follows').create({
        followingId: data.organizationId,
        type: 'organizations',
        userId: data.currentUserId
      })
    }
  }
}
