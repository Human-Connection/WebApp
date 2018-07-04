import {isArray} from 'lodash'

export const state = () => {
  return {
    settings: {
      _id: null,
      invites: {
        userCanInvite: false,
        maxInvitesByUser: 1
      },
      maintenance: false
    }
  }
}

export const mutations = {
  set (state, settings) {
    state.settings = Object.assign(state.settings, settings)
  }
}

export const getters = {
  get (state) {
    return state.settings
  }
}

export const actions = {
  // Called from nuxtServerInit in index
  init ({dispatch}) {
    return dispatch('fetch')
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
    const service = this.app.$api.service('settings')
    let res
    if (state.settings._id) {
      res = await service.patch(state.settings._id, data)
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
