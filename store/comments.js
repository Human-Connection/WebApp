import { castArray, debounce } from 'lodash'

export const state = () => {
  return {
    comments: [],
    isLoading: true,
    contributionId: null,
    isSubmitting: false
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
  },
  setIsSubmitting (state, status) {
    state.isSubmitting = status
  }
}

export const getters = {
  all (state) {
    return state.comments
  },
  isSubmitting (state) {
    return state.isSubmitting
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
      .on('removed', debounce((comment) => {
        dispatch('fetchByContributionId')
      }, 500))
  },
  fetchByContributionId ({commit, state}, contributionId) {
    contributionId = contributionId || state.contributionId
    if (!contributionId) {
      return
    }
    commit('setContributionId', contributionId)
    // TODO: implement pagination for comments
    return this.app.$api.service('comments').find({
      query: {
        contributionId: contributionId,
        $sort: {
          // upvoteCount: -1,
          createdAt: 1
        },
        $limit: 100
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
  create ({dispatch}, data) {
    return this.app.$api.service('comments').create(data)
  },
  patch ({dispatch}, data) {
    return this.app.$api.service('comments').patch(data._id, data)
  },
  remove ({dispatch}, id) {
    return this.app.$api.service('comments').remove(id)
  },
  setSubmitting ({commit}, status) {
    commit('setIsSubmitting', status)
    return status
  }
}
