import feathers from '~/plugins/feathers'
import _ from 'lodash'

const categoriesService = feathers.service('categories')

export const state = () => {
  return {
    categories: []
  }
}

export const mutations = {
  set (state, categories) {
    state.categories = _.castArray(categories)
  },
  // [vuex] unknown local mutation type: clear, global type: categories/clear
  clear (state) {
    state.categories = []
  }
}

export const getters = {
  all (state) {
    return state.categories
  }
}

export const actions = {
  // Called from nuxtServerInit in index
  init ({dispatch}) {
    return dispatch('fetch')
  },
  // Called from plugins/init-store-subscriptions only once
  subscribe ({dispatch}) {
    return categoriesService
      .on('created', () => {
        dispatch('fetch')
      })
  },
  fetch ({commit}) {
    return categoriesService.find({
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
    return categoriesService.create(category)
  },
  patch ({dispatch}, category) {
    return categoriesService.patch(category._id, category)
  },
  delete ({dispatch}, category) {
    return categoriesService.remove(category._id)
  }
}
