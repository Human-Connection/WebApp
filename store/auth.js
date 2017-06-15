import feathers from '~plugins/feathers'

export const state = () => {
  return {
    user: null
  }
}

export const mutations = {
  SET_USER (state, user) {
    state.user = user || null
  }
}

export const getters = {
  isAuthenticated (state) {
    return !!state.user
  },
  user (state) {
    return state.user
  }
}

export const actions = {
  jwt ({commit}, {accessToken}) {
    return feathers.authenticate({strategy: 'jwt', accessToken})
      .then(response => {
        return feathers.passport.verifyJWT(response.accessToken)
      })
      .then(payload => {
        return feathers.service('users').get(payload.userId)
      })
      .then(user => {
        commit('SET_USER', user)
      })
  },
  login ({commit}, {email, password}) {
    return feathers.authenticate({strategy: 'local', email, password})
      .then(response => {
        return feathers.passport.verifyJWT(response.accessToken)
      })
      .then(payload => {
        return feathers.service('users').get(payload.userId)
      })
      .then(user => {
        commit('SET_USER', user)
      })
  },
  logout ({commit}) {
    return feathers.logout()
      .then(() => {
        commit('SET_USER', null)
      })
  },
  register ({dispatch}, {email, password}) {
    return feathers.service('users').create({email, password})
      .then(response => {
        return dispatch('login', {email, password})
      })
  }
}
