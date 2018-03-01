import _ from 'lodash'

export const state = () => {
  return {
    notifications: false
  }
}

export const mutations = {
  set (state, notifications) {
    if (!notifications || notifications === undefined) {
      state.notifications = null
    } else {
      state.notifications = notifications
    }
  },
  clear (state) {
    state.notifications = []
  },
  add (state, notification) {
    state.notifications.unshift(notification)
  }
}

export const getters = {
  all (state) {
    return state.notifications
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
  fetch ({commit}) {
    return this.app.$api.service('notifications').find({
      query: {
        $limit: 30,
        $sort: {
          createdAt: -1
        },
        unseen: true
      }
    })
      .then((result) => {
        commit('set', result.data)
      })
      .catch(() => {
        commit('clear')
      })
  },
  markAsRead ({dispatch}, data) {
    return this.app.$api.service('notifications').patch(data.id, {
      unseen: false
    })
  }
}
