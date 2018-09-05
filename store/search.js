import { clone } from 'lodash'
import searchQueryBuilder from './utils/search-query-builder'

export default {
  namespaced: true,
  state: {
    query: '',
    filter: {
      categoryIds: [],
      emotions: []
    }
  },

  mutations: {
    query (state, query) {
      if (!query || query === undefined) {
        state.query = null
      } else {
        state.query = query

        // go to newsfeed to see search results
        if (this.app.router.currentRoute.name !== 'index') {
          this.app.router.push({ name: 'index' })
        }
      }
    },
    categoryIds (state, categoryIds) {
      if (!categoryIds || categoryIds === undefined) {
        state.filter.categoryIds = []
      } else {
        state.filter.categoryIds = clone(categoryIds)
      }
    },
    emotions (state, emotions) {
      if (!emotions || emotions === undefined) {
        state.filter.emotions = []
      } else {
        state.filter.emotions = clone(emotions)
      }
    }
  },

  getters: {
    query (state) {
      return state.query
    },
    categoryIds (state) {
      return clone(state.filter.categoryIds)
    },
    emotions (state) {
      return clone(state.filter.emotions)
    },
    all (state) {
      return state
    },
    queryEmotions (state, getters, rootState, rootGetters) {
      // generate the emotions filter query by using the selected emotions
      return searchQueryBuilder.buildFilterEmotions(getters.emotions, {})
    },
    queryCategories (state, getters, rootState, rootGetters) {
      // generate the category filter query by using the selected category ids
      return searchQueryBuilder.buildFilterCategories(getters.categoryIds, {})
    },
    queryLanguages (state, getters, rootState, rootGetters) {
      if (rootState.auth.user) {
        const languages = rootGetters['auth/userSettings'].contentLanguages
        return searchQueryBuilder.buildFilterLanguages(languages, {})
      } else {
        return {}
      }
    },
    querySearch (state, getters, rootState, rootGetters) {

    }
  },
  actions: {}
}
