import { clone } from 'lodash'

export const state = () => {
  return {
    query: '',
    filter: {
      categoryIds: [],
      emotions: []
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
}

export const getters = {
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
  }
}

export const actions = {}
