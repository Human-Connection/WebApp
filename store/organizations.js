import feathers from '~/plugins/feathers'

export const actions = {
  async patch ({state}, data) {
    if (!data.organizationId) {
      return null
    }
    const organization = await feathers.service('organizations').patch(data.organizationId, data)
    return organization
  }
}
