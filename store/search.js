import _ from 'lodash'

export const state = () => {
  return {
    query: '',
    filter: {
      categoryIds: [],
      emotions: {
        angry: false
      }
    }
  }
}

export const mutations = {
  query (state, query) {
    if (!query || query === undefined) {
      state.query = null
    } else {
      state.query = query
    }
  },
  categoryIds (state, categoryIds) {
    if (!categoryIds || categoryIds === undefined) {
      state.filter.categoryIds = []
    } else {
      state.filter.categoryIds = _.clone(categoryIds)
    }
  }
}

export const getters = {
  query (state) {
    return state.query
  },
  categoryIds (state) {
    return _.clone(state.filter.categoryIds)
  },
  all (state) {
    return state
  }
}

export const actions = {}
