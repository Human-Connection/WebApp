import _ from 'lodash'

export const state = () => {
  return {
    total: 0,
    notifications: false
  }
}

export const mutations = {
  total (state, total) {
    state.total = total
  },
  set (state, notifications) {
    if (!notifications || notifications === undefined) {
      state.notifications = null
    } else {
      state.notifications = notifications
    }
  },
  clear (state) {
    state.total = 0
    state.notifications = []
  },
  add (state, notification) {
    state.notifications.unshift(notification)
  }
}

export const getters = {
  all (state) {
    return state.notifications
  },
  total (state) {
    return state.total
  }
}

export const actions = {
  // Called from nuxtServerInit in index
  init ({dispatch}) {
    return dispatch('fetch')
  },
  // Called from plugins/init-store-subscriptions only once
  subscribe ({dispatch}) {
    return this.app.$api.service('notifications')
      .on('created', _.debounce(() => {
        dispatch('fetch')
      }, 500))
      .on('patched', _.debounce(() => {
        dispatch('fetch')
      }, 500))
  },
  fetch ({commit, rootGetters}) {
    return this.app.$api.service('notifications').find({
      query: {
        $limit: 30,
        $sort: {
          createdAt: -1
        },
        userId: rootGetters['auth/user']._id,
        unseen: true
      }
    })
      .then((result) => {
        commit('total', result.total)
        commit('set', result.data)
      })
      .catch(() => {
        commit('clear')
      })
  },
  markAsRead ({dispatch}, {notification}) {
    let query = [{
      id: notification._id
    }]

    if (!_.isEmpty(notification.relatedContributionId)) {
      query.push({
        relatedContributionId: notification.relatedContributionId
      })
    }

    return this.app.$api.service('notifications').patch(null, {
      unseen: false
    }, {
      query: {
        $or: query
      }
    })
  }
}
