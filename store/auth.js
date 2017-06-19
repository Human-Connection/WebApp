import feathers from '~plugins/feathers'

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
  user (state) {
    return state.user
  }
}

/*
 somehow the jwt method outputs an old json token or gets an old one as it does login you as the previous user
 TODO: this needs to be fixed as soon as possible
 */
export const actions = {
  async jwt ({commit}, {accessToken}) {
    try {
      console.info('#TRY TO GET TOKEN ' + accessToken)
      const response = await feathers.authenticate({strategy: 'jwt', accessToken})
      const payload = await feathers.passport.verifyJWT(response.accessToken)
      const user = await feathers.service('users').get(payload.userId)
      console.info(user.email)
      commit('SET_USER', user)
    } catch (err) {
      console.error(err.message)
    }
  },
  async login ({commit}, {email, password}) {
    try {
      console.info('#TRY TO LOGIN ' + email)
      await feathers.logout()
      commit('SET_USER', null)
      feathers.set('user', null)

      const response = await feathers.authenticate({strategy: 'local', email, password})

      console.info('#GOT LOGIN TOKEN ' + response.accessToken)
      const payload = await feathers.passport.verifyJWT(response.accessToken)
      const user = await feathers.service('users').get(payload.userId)
      commit('SET_USER', user)
    } catch (err) {
      console.error(err.message)
      commit('SET_USER', null)
    }
  },
  async logout ({commit}) {
    console.info('#TRY TO LOGOUT')
    try {
      await feathers.logout()
    } catch (err) {
      console.error(err.message)
    }
    commit('SET_USER', null)
    feathers.set('user', null)
  },
  register ({dispatch}, {email, password}) {
    return feathers.service('users').create({email, password})
      .then(response => {
        return dispatch('login', {email, password})
      })
  }
}
