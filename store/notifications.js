import feathers from '~plugins/feathers'

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
  fetch ({commit}) {
    return feathers.service('notifications').find({
      query: {
        '$limit': 30,
        '$sort': {
          createdAt: -1
        }
      }
    })
      .then((result) => {
        commit('set', result.data)
      })
      .catch(() => {
        commit('clear')
      })
  }
}
