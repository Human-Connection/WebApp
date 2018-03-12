export const state = () => {
  return {
    env: {}
  }
}

export const mutations = {
  SET_ENV (state, env) {
    state.env = env
  }
}

export const getters = {
  all (state) {
    return state.env
  }
}

export const actions = {
  init ({commit}) {
    if (process.server) {
      commit('SET_ENV', require('dotenv').config().parsed)
    }
  }
}
