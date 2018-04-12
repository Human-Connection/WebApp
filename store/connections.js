import { castArray } from 'lodash'

export const state = () => {
  return {
    follow: {
      foreignId: null,
      foreignService: null,
      isPending: false,
      isFollowing: false,
      count: 0
    }
  }
}

export const mutations = {
  follow (state, follow) {
    state.follow = follow
  }
}

export const getters = {
  isFollowing (state) {
    return state.follow.isFollowing
  },
  follow (state) {
    return state.follow
  }
}

export const actions = {
  // Called from plugins/init-store-subscriptions only once
  // subscribe ({dispatch}) {
  //   return this.app.$api.service('comments')
  //     .on('created', debounce((comment) => {
  //       dispatch('fetchByContributionId')
  //     }, 500))
  //     .on('patched', debounce((comment) => {
  //       dispatch('fetchByContributionId')
  //     }, 500))
  // },
  async syncFollow ({state, commit}, {userId, foreignId, foreignService}) {
    let status = Object.assign({}, state.follow)
    status.isPending = true
    commit('follow', status)

    const res = await this.app.$api.service('follows').find({
      query: {
        userId,
        foreignId,
        foreignService
      }
    })

    console.log('res', res)

    status = Object.assign({}, state.follow)
    status.isPending = false

    status.isFollowing = res && Boolean(res._id)

    commit('follow', status)
  },
  async follow ({state, commit}, {foreignId, foreignService}) {
    console.log('TRY TO FOLLOW', foreignId, foreignService)

    const status = Object.assign({}, state.follow)
    status.isPending = true

    const res = await this.app.$api.service('follows').create({
      foreignId,
      foreignService
    })

    status.isFollowing = res.length
    status.isPending = false

    commit('follow', status)
  }
}
