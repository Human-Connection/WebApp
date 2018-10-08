import feathersVuex from 'feathers-vuex'

let servicePlugin = (feathersClient) => {
  const { service } = feathersVuex(feathersClient, { idField: '_id' })
  const servicePath = 'usersettings'
  const servicePlugin = service(servicePath, {
    namespace: 'feathers-vuex-usersettings',
    instanceDefaults: {
      blacklist: []
    },
    getters: {
      isBlacklisted: (state) => (entity) => {
        let current = state.copy
        let { blacklist } = current || {}
        return blacklist && blacklist.includes(entity._id)
      },
      isPending: (state) => {
        return (
          state.current ||
          state.isFindPending ||
          state.isGetPending ||
          state.isCreatePending ||
          state.isUpdatePending ||
          state.isPatchPending ||
          state.isRemovePending
        )
      }
    },
    actions: {
      async loadCurrent ({commit, dispatch, state}, user) {
        let userId = user._id
        if (!userId) return null
        let { data } = await dispatch('find', {
          query: { userId }
        })
        if (data.length > 0) {
          commit('setCurrent', data[0])
        } else {
          commit('setCurrent', {})
        }
      },
      async toggleBlacklist ({commit, dispatch, state}, foreignEntity) {
        let current = state.copy
        let blacklist = current.blacklist
        if (blacklist.includes(foreignEntity._id)) {
          blacklist = blacklist.filter(id => id !== foreignEntity._id)
        } else {
          blacklist.push(foreignEntity._id)
        }
        current.blacklist = blacklist
        commit('setCurrent', current)
        if (current._id) { return dispatch('patch', [current._id, current, {}]) }
        return current.save()
      }
    }
  })
  return servicePlugin
}
export default servicePlugin
