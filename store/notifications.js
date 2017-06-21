import feathers from '~plugins/feathers'

export const state = () => {
  return {
    notifications: false
  }
}

export const mutations = {
  SET (state, notifications) {
    if (!notifications || notifications === undefined) {
      state.notifications = null
    } else {
      state.notifications = notifications
    }
  },
  CLEAR (state) {
    state.notifications = []
  }
}

export const getters = {
  notifications (state) {
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
        commit('SET', result.data)
      })
      .catch(() => {
        commit('CLEAR')
      })
  },
  clear ({commit}) {
    commit('CLEAR')
  }
}
