export const state = () => {
  return {
    change: 0
  }
}

export const mutations = {
  CHANGE_LAYOUT (state) {
    state.change++
  }
}

export const getters = {
  change (state) {
    return state.change
  }
}

export const actions = {
  change ({commit}) {
    commit('CHANGE_LAYOUT')
  }
}
