import { castArray } from 'lodash'

export default {
  namespaced: true,
  state: {
    categories: []
  },
  mutations: {
    set (state, categories) {
      state.categories = castArray(categories)
    },
    // [vuex] unknown local mutation type: clear, global type: categories/clear
    clear (state) {
      state.categories = []
    }
  },

  getters: {
    all (state) {
      return state.categories
    }
  },

  actions: {
    // Called from nuxtServerInit in index
    init ({state, dispatch}) {
      if (state.categories.length) {
        // do not fetch again
        return
      }
      return dispatch('fetch')
    },
    // Called from plugins/init-store-subscriptions only once
    subscribe ({dispatch}) {
      return this.app.$api.service('categories')
        .on('created', () => {
          dispatch('fetch')
        })
    },
    fetch ({commit}) {
      return this.app.$api.service('categories').find({
        query: {
          '$limit': 200,
          '$sort': {
            slug: 1
          }
        }
      })
        .then((result) => {
          commit('set', result.data)
        })
        .catch(() => {
          commit('clear')
        })
    },
    create ({dispatch}, category) {
      return this.app.$api.service('categories').create(category)
    },
    patch ({dispatch}, category) {
      return this.app.$api.service('categories').patch(category._id, category)
    },
    delete ({dispatch}, category) {
      return this.app.$api.service('categories').remove(category._id)
    }
  }
}
