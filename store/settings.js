import {isArray, intersection} from 'lodash'

export default {
  namespaced: true,
  state: {
    settings: {
      _id: null,
      invites: {
        userCanInvite: false,
        onlyUserWithBadgesCanInvite: [],
        maxInvitesByUser: 1
      },
      maintenance: false
    }
  },

  mutations: {
    set (state, settings) {
      state.settings = Object.assign(state.settings, settings)
    }
  },

  getters: {
    get (state) {
      return state.settings
    },
    showInvites (state, getters, rootState, rootGetters) {
      if (!state.settings.invites.userCanInvite) {
        return false
      }

      const user = rootGetters['auth/user']
      const badgeIds = user.badgeIds || []
      const inviteBadgeIds = state.settings.invites.onlyUserWithBadgesCanInvite

      if (user.role === 'admin') {
        return true
      }

      if (inviteBadgeIds.length) {
        return intersection(badgeIds, inviteBadgeIds).length
      }
      return state.settings.invites.userCanInvite
    }
  },
  actions: {
    // Called from nuxtServerInit in index
    init ({dispatch}) {
      return dispatch('fetch')
    },
    // Called from plugins/init-store-subscriptions only once
    subscribe ({state, commit}) {
      return this.app.$api.service('settings')
        .on('patched', (data) => {
          if (state.settings._id === data._id) {
            commit('set', data)
          }
        })
    },
    async fetch ({commit}) {
      const service = this.app.$api.service('settings')
      let res = await service.find({query: {key: 'system'}})
      if (isArray(res)) {
        res = res.pop()
      }

      await commit('set', res)

      return res
    },
    async patch ({state, commit}, data) {
      data = JSON.parse(JSON.stringify(data))
      const service = this.app.$api.service('settings')
      let res
      if (state.settings._id) {
        res = await service.patch(state.settings._id, Object.assign(JSON.parse(JSON.stringify(state.settings)), data))
      } else {
        res = await service.create(data)
      }
      if (isArray(res)) {
        res = res.pop()
      }

      await commit('set', res)

      return res
    }
  }
}
