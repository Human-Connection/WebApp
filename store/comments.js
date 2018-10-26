import { castArray, debounce, uniqWith, orderBy } from 'lodash'

export const state = () => {
  return {
    comments: [],
    commentCount: 0,
    showComment: null,
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
  setCommentCount (state, commentCount) {
    state.commentCount = commentCount
  },
  setChildCommentCount (state, childCommentCount) {
    state.childCommentCount = childCommentCount
  },
  setShowComment (state, showComment) {
    state.showComment = showComment
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
  showComment (state) {
    return state.showComment
  },
  count (state) {
    return state.commentCount
  },
  childCount (state) {
    return state.childCount
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
    return dispatch('fetchByContributionId', contributionId)
      .then(() => {
        if (state.commentCount > (state.comments.length + state.childCommentCount)) {
          return dispatch('fetchAllByContributionId', contributionId)
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
        $limit: 30
      }
    }).then((result) => {
      const resComments = addChildrenIfNecessary(state.comments, result.data)
      let childCommentCount = 0
      resComments.forEach((el) => {
        childCommentCount += el.children.length
      })
      // as we load new comments, make sure they are in the right order and unique
      let newComments = orderBy(uniqWith(resComments, (a, b) => a._id === b._id), ['createdAt'], ['asc'])
      commit('setCommentCount', result.total)
      commit('setChildCommentCount', childCommentCount)
      commit('set', newComments)
      commit('isLoading', false)
    }).catch((e) => {
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

function addChildrenIfNecessary(storeComments, newComments) {
  const resultComments = JSON.parse(JSON.stringify(storeComments))
  newComments.forEach((element) => {
    if (element.parentCommentId) {
      const comment = resultComments.filter((el) => {
        return el._id === element.parentCommentId
      })
      if (comment[0].children.filter((el) => {
        return el._id === element._id
      }).length === 0) {
        comment[0].children.push(element)
      }
    } else {
      resultComments.push(element)
    }
  })
  resultComments.children = orderBy(uniqWith(resultComments.children, function (a, b) {
    return a._id === b._id;
  }), ['createdAt'], ['asc']);
  return resultComments
}
