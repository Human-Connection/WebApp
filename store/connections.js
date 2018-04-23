export const state = () => {
  return {
    follow: {
      _id: null,
      userId: null,
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
  follow (state) {
    return state.follow
  }
}

export const actions = {
  async syncFollow ({state, commit}, {userId, foreignId, foreignService}) {
    console.log('TRY TO GET FOLLOW STATUS', userId, foreignId, foreignService)
    let status = Object.assign({}, state.follow)

    if (status.userId !== userId) {
      status.count = 0
    }
    status.userId = userId
    status.isPending = true
    commit('follow', status)

    status = Object.assign({}, state.follow)

    try {
      const res = await this.app.$api.service('follows').find({
        query: {
          userId,
          foreignId,
          foreignService
        }
      })
      console.log('++++++++++++res', res)
      status.count = res.total
      status._id = res.data.length ? res.data[0]._id : null
    } catch (err) {}

    status.isFollowing = Boolean(status._id)
    status.isPending = false

    console.log('***************', status)

    commit('follow', status)
  },
  async follow ({state, commit, dispatch}, {foreignId, foreignService}) {
    console.log('TRY TO FOLLOW', foreignId, foreignService)

    let status = Object.assign({}, state.follow)
    status.isPending = true
    commit('follow', status)

    status = Object.assign({}, state.follow)

    try {
      await this.app.$api.service('follows').create({
        foreignId,
        foreignService
      })
    } catch (err) {}

    status.isFollowing = true
    // status.isPending = false

    commit('follow', status)

    dispatch('syncFollow', {
      userId: state.follow.userId,
      foreignId: foreignId,
      foreignService: foreignService
    })
  },
  async unfollow ({state, commit, dispatch}, {_id}) {
    console.log('TRY TO UNFOLLOW', _id)

    let status = Object.assign({}, state.follow)
    status.isPending = true
    commit('follow', status)

    status = Object.assign({}, state.follow)

    try {
      await this.app.$api.service('follows').remove({
        _id: _id
      })
    } catch (err) {}

    status.isFollowing = false
    status.count--
    // status.isPending = false
    status._id = null
    commit('follow', status)

    dispatch('syncFollow', {
      userId: state.follow.userId,
      foreignId: state.follow.foreignId,
      foreignService: state.follow.foreignService
    })
  }
}
