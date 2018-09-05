export default {
  namespaced: true,
  state: {
    follow: {
      _id: null,
      userId: null,
      foreignId: null,
      foreignService: null,
      isPending: false,
      isFollowing: false,
      count: 0
    }
  },

  mutations: {
    follow (state, follow) {
      state.follow = follow
    }
  },

  getters: {
    follow (state) {
      return state.follow
    }
  },

  actions: {
    async syncFollow ({state, commit}, {userId, foreignId, foreignService}) {
      let status = Object.assign({}, state.follow)

      if (status.userId !== userId) {
        status.count = 0
      }
      status.userId = userId
      status.foreignId = foreignId
      status.foreignService = foreignService
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
        status.count = res.total || 0
        status._id = res.data.length ? res.data[0]._id : null
      } catch (err) {
        console.error(err)
        status.count = 0
      }

      status.isFollowing = Boolean(status._id)
      status.isPending = false

      commit('follow', status)
    },
    async follow ({state, commit, dispatch}, {foreignId, foreignService}) {
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
}
