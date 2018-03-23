import { castArray, debounce } from 'lodash'

export const state = () => {
  return {
    comments: [],
    isLoading: true,
    contributionId: null
  }
}

export const mutations = {
  isLoading (state, status) {
    state.isLoading = status
  },
  set (state, comments) {
    state.comments = castArray(comments)
  },
  clear (state) {
    state.comments = []
  },
  setContributionId (state, contributionId) {
    state.contributionId = contributionId
  }
}

export const getters = {
  all (state) {
    return state.comments
  },
  isLoading (state) {
    return state.isLoading
  },
  count (state) {
    return state.comments.length
  }
}

export const actions = {
  // Called from plugins/init-store-subscriptions only once
  subscribe ({dispatch}) {
    return this.app.$api.service('comments')
      .on('created', debounce((comment) => {
        dispatch('fetchByContributionId')
      }, 500))
      .on('patched', debounce((comment) => {
        dispatch('fetchByContributionId')
      }, 500))
  },
  fetchByContributionId ({commit, state}, contributionId) {
    contributionId = contributionId || state.contributionId
    commit('setContributionId', contributionId)
    return this.app.$api.service('comments').find({
      query: {
        contributionId: contributionId,
        $sort: {
          // upvoteCount: -1,
          createdAt: 1
        },
        $limit: 50
      }
    })
      .then((result) => {
        commit('set', result.data)
        commit('isLoading', false)
      })
      .catch((e) => {
        commit('isLoading', false)
      })
  },
  fetchById ({commit}, id) {
    return this.app.$api.service('comments').get(id)
  },
  upvote ({dispatch}, comment) {
    return this.app.$api.service('comments').patch(comment._id, {
      $inc: {
        upvoteCount: 1
      }
    }).then((res) => {
      dispatch('fetchByContributionId', comment.contributionId)
    })
  },
  async create ({dispatch}, data) {
    return this.app.$api.service('comments').create(data)
  }
}
