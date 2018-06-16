import _ from 'lodash'

const options = {
  limit: 10
}

export const state = () => {
  return {
    total: 0,
    unseenTotal: 0,
    notifications: false
  }
}

export const mutations = {
  total (state, total) {
    state.total = total
  },
  unseenTotal (state, unseenTotal) {
    state.unseenTotal = unseenTotal
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
    state.unseenTotal = 0
    state.notifications = []
  },
  add (state, notification) {
    const index = state.notifications.findIndex(item => {
      return item._id === notification._id
    })
    // Replace existing notification
    if (index > -1) {
      state.notifications.splice(index, 1, notification)
    // Or add new one
    } else {
      state.notifications.unshift(notification)
    }
  },
  addMany (state, notifications) {
    if (notifications || notifications.length) {
      state.notifications.push(...notifications)
    }
  }
}

export const getters = {
  all (state) {
    return state.notifications
  },
  total (state) {
    return state.total
  },
  unseenTotal (state) {
    return state.unseenTotal
  },
  hasMore (state) {
    return state.total &&
      state.total > state.notifications.length
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
      .on('created', async (notification) => {
        await dispatch('fetchOne', notification)
        // Fetch total after notification is added
        // Because it triggers infinite loader
        dispatch('fetchTotal')
      })
      .on('patched', (notification) => {
        dispatch('fetchOne', notification)
      })
  },
  find ({rootGetters}, queryParams) {
    let query = {
      $limit: options.limit,
      $sort: {
        createdAt: -1
      },
      userId: rootGetters['auth/user']._id,
      ...queryParams
    }
    return this.app.$api.service('notifications').find({ query })
  },
  fetch ({commit, dispatch}) {
    dispatch('fetchTotal')
    return dispatch('find')
      .then((result) => {
        commit('set', result.data)
      })
      .catch(error => {
        console.error('fetch could not fetch notifications', error)
      })
  },
  fetchMore ({state, commit, dispatch}) {
    const $skip = state.notifications.length
    return dispatch('find', { $skip })
      .then((result) => {
        commit('addMany', result.data)
      })
      .catch(error => {
        console.error('fetchMore could not fetch notifications', error)
      })
  },
  fetchOne ({commit, dispatch, rootGetters}, notification) {
    // Only fetch notification for current user
    if (notification.userId !== rootGetters['auth/user']._id) {
      return
    }
    return this.app.$api.service('notifications').get(notification._id)
      .then((result) => {
        commit('add', result)
      })
      .catch(error => {
        console.error('fetchOne could not fetch notification:', notification._id)
        console.error(error)
      })
  },
  fetchTotal ({commit, rootGetters}) {
    let requests = []
    requests.push(this.app.$api.service('notifications').find({
      query: {
        $limit: 0,
        userId: rootGetters['auth/user']._id,
        unseen: true
      }
    })
      .then((result) => {
        commit('unseenTotal', result.total)
      })
      .catch(() => {
        commit('clear')
      }))
    requests.push(this.app.$api.service('notifications').find({
      query: {
        $limit: 0,
        userId: rootGetters['auth/user']._id
      }
    })
      .then((result) => {
        commit('total', result.total)
      })
      .catch(() => {
        commit('clear')
      }))
    return Promise.all(requests)
  },
  markAsRead ({dispatch}, {notification}) {
    let query = [{
      id: notification._id
    }]

    if (!_.isEmpty(notification.relatedContributionId)) {
      query.push({
        relatedContributionId: notification.relatedContributionId,
        unseen: true
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
