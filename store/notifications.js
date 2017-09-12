import feathers from '~/plugins/feathers'
import _ from 'lodash'

const notificationsService = feathers.service('notifications')

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
    return notificationsService
      .on('created', _.debounce(() => {
        dispatch('fetch')
      }, 500))
      .on('patched', _.debounce(() => {
        dispatch('fetch')
      }, 500))
  },
  fetch ({commit}) {
    return notificationsService.find({
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
    return notificationsService.patch(null, {
      unseen: false
    }, {
      query: {
        relatedContributionId: data.id
      }
    })
  }
}
