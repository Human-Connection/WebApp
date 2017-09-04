import feathers from '~/plugins/feathers'

export const state = () => {
  return {
    user: null
  }
}

export const mutations = {
  SET_USER (state, user) {
    if (!user || user === undefined) {
      state.user = null
    } else {
      state.user = user
    }
  }
}

export const getters = {
  isAuthenticated (state) {
    return !!state.user
  },
  isVerified (state) {
    return !!state.user && state.user.isVerified && !!state.user.name
  },
  isAdmin (state) {
    return !!state.user && state.user.role === 'admin'
  },
  user (state) {
    return state.user
  }
}

export const actions = {
  async jwt ({commit, dispatch}, {accessToken}) {
    try {
      await feathers.logout()
      const response = await feathers.authenticate({strategy: 'jwt', accessToken})
      const payload = await feathers.passport.verifyJWT(response.accessToken)
      const user = await feathers.service('users').get(payload.userId)
      commit('SET_USER', user)
      dispatch('notifications/fetch', null, { root: true })
    } catch (err) {
      console.error(err.message)
    }
  },
  async login ({commit}, {email, password}) {
    try {
      await feathers.logout()
      commit('SET_USER', null)
      feathers.set('user', null)

      const response = await feathers.authenticate({strategy: 'local', email, password})

      const payload = await feathers.passport.verifyJWT(response.accessToken)
      const user = await feathers.service('users').get(payload.userId)
      commit('SET_USER', user)
    } catch (err) {
      console.error(err.message)
      commit('SET_USER', null)
      throw new Error(err.message)
    }
  },
  async logout ({commit}) {
    try {
      await feathers.logout()
    } catch (err) {
      console.error(err.message)
    }
    commit('SET_USER', null)
    commit('notifications/clear', null, { root: true })
    feathers.set('user', null)
  },
  register ({dispatch}, {email, password}) {
    return feathers.service('users').create({email, password})
      .then(response => {
        return dispatch('login', {email, password})
      })
  },
  patch ({state, commit}, data) {
    return feathers.service('users').patch(state.user._id, data)
      .then(user => {
        commit('SET_USER', user)
      })
      .catch(err => {
        console.log(err.message)
      })
  },
  verify ({dispatch}, verifyToken) {
    if (!verifyToken) { return false }
    return feathers.service('authManagement').create({
      action: 'verifySignupLong',
      value: verifyToken
    })
      .then(() => {
        return true
      })
      .catch(err => {
        console.log(err.message)
      })
  },
  resendVerifySignup ({state}) {
    return feathers.service('authManagement').create({
      action: 'resendVerifySignup',
      value: {
        email: state.user.email
      }
    })
      .then(() => {
        return true
      })
      .catch(err => {
        console.log(err.message)
      })
  }
}
