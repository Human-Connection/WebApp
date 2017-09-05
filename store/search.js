export const state = () => {
  return {
    query: '',
    filter: {
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
  }
}

export const getters = {
  query (state) {
    return state.query
  },
  all (state) {
    return state
  }
}

export const actions = {}
