import { castArray, debounce, uniq, orderBy } from 'lodash'

export const state = () => {
  return {
    comments: [],
    commentCount: 0,
    showComment: null,
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
  setCommentCount (state, commentCount) {
    state.commentCount = commentCount
  },
  setShowComment (state, showComment) {
    state.showComment = showComment
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
  showComment (state) {
    return state.showComment
  },
  count (state) {
    return state.commentCount
  }
}

export const actions = {
  // Called from plugins/init-store-subscriptions only once
  subscribe ({commit, dispatch}) {
    return this.app.$api.service('comments')
      .on('created', debounce((comment) => {
        dispatch('fetchAllByContributionId')
        commit('setShowComment', comment._id)
      }, 500))
      .on('patched', debounce((comment) => {
        dispatch('fetchByContributionId')
      }, 500))
      .on('removed', debounce((comment) => {
        dispatch('fetchByContributionId')
      }, 500))
  },
  fetchAllByContributionId ({dispatch, state}, contributionId) {
    dispatch('fetchByContributionId', contributionId)
      .then(() => {
        if (state.comments.length < state.commentCount) {
          dispatch('fetchAllByContributionId', contributionId)
        }
      })
  },
  fetchByContributionId ({commit, state}, contributionId) {
    contributionId = contributionId || state.contributionId
    if (!contributionId) {
      return
    }
    commit('setContributionId', contributionId)

    return this.app.$api.service('comments').find({
      query: {
        contributionId: contributionId,
        $sort: {
          // upvoteCount: -1,
          createdAt: 1
        },
        $skip: state.comments.length,
        $limit: 100
      }
    })
      .then((result) => {
        // as we load new comments, make sure they are in the right order and unique
        let newComments = orderBy(uniq(state.comments.concat(result.data)), ['createdAt'], ['asc'])
        commit('setCommentCount', result.total)
        commit('set', newComments)
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
  }
}
