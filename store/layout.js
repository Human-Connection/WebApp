export const state = () => {
  return {
    change: 0,
    sidebar: {
      open: false
    }
  }
}

export const mutations = {
  CHANGE_LAYOUT (state) {
    state.change++
  },
  CLOSE_SIDEBAR (state) {
    state.sidebar.open = false
  },
  OPEN_SIDEBAR (state) {
    state.sidebar.open = true
  },
  TOGGLE_SIDEBAR (state) {
    state.sidebar.open = !state.sidebar.open
  }
}

export const getters = {
  change (state) {
    return state.change
  },
  sidebar (state) {
    return state.sidebar
  }
}

export const actions = {
  change ({commit}) {
    commit('CHANGE_LAYOUT')
  },
  closeSidebar ({commit}) {
    commit('CLOSE_SIDEBAR')
  },
  openSidebar ({commit}) {
    commit('OPEN_SIDEBAR')
  },
  toggleSidebar ({commit}) {
    commit('TOGGLE_SIDEBAR')
  }
}
