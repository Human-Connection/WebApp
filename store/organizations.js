import feathers from '~/plugins/feathers'

export const actions = {
  async patch ({dispatch}, organization) {
    if (!organization) {
      return null
    }
    return feathers.service('organizations').patch(organization._id, organization)
  },
  create ({dispatch}, {organization}) {
    console.log(organization)
    return feathers.service('organizations').create({organization})
      .then(res => {
        return dispatch(`organization/_slug/${res.slug}`)
      })
  }
}
