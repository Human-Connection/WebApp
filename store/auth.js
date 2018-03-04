import { isEmpty } from 'lodash'

export const state = () => {
  return {
    user: null,
    token: null
  }
}

export const mutations = {
  SET_USER (state, user) {
    state.user = user || null
  },
  SET_TOKEN (state, token) {
    state.token = token || null
  }
}

export const getters = {
  isAuthenticated (state) {
    return !!(state.user && state.token)
  },
  isVerified (state) {
    return !!state.user && state.user.isVerified && !!state.user.name
  },
  isAdmin (state) {
    return !!state.user && state.user.role === 'admin'
  },
  isModerator (state) {
    return !!state.user && (state.user.role === 'admin' || state.user.role === 'moderator')
  },
  user (state) {
    return state.user
  },
  token (state) {
    return state.token
  }
}

export const actions = {
  async init ({commit, dispatch, state}) {
    let user
    // get fresh jwt token
    await dispatch('refreshJWT', 'auth/init')

    // check if the token is autenticated
    const isAuthenticated = await dispatch('checkAuth')
    if (isAuthenticated) {
      const payload = await this.app.$api.passport.verifyJWT(state.token)
      user = await this.app.$api.service('users').get(payload.userId)
      commit('SET_USER', user)
    }
    return user
  },
  async refreshJWT ({state, getters, commit}, source = null) {
    const token = await this.app.$api.passport.getJWT()
    commit('SET_TOKEN', token)

    if (process.env.NODE_ENV === 'development') {
      console.log('### refreshJWT', source, !isEmpty(token), getters.isAuthenticated)
    }

    let user
    if (token) {
      user = await this.app.$api.auth({strategy: 'jwt', accessToken: token})
      commit('SET_USER', user)
    }
    return user
  },
  async checkAuth ({state, getters, commit}) {
    const token = await this.app.$api.passport.getJWT()
    commit('SET_TOKEN', token)

    if (!token) {
      return false
    }
    const payload = await this.app.$api.passport.verifyJWT(token)
    const payloadValid = this.app.$api.passport.payloadIsValid(payload)
    if (payloadValid) {
      commit('SET_TOKEN', token)
    } else {
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
    }

    return payloadValid === true
  },
  async login ({commit, dispatch}, {email, password}) {
    try {
      const user = await this.app.$api.auth({strategy: 'local', email, password})
      const locale = this.app.$cookies.get('locale')
      if (user && user.language !== locale && !isEmpty(locale)) {
        user.language = locale
        dispatch('patch', {
          language: user.language
        })
      }

      commit('SET_USER', user)
      commit('newsfeed/clear', null, { root: true })

      return user
    } catch (err) {
      commit('SET_USER', null)
      // commit('SET_TOKEN', null)
      throw new Error(err.message)
    }
  },
  async logout ({commit}) {
    await this.app.$api.logout()
    commit('SET_USER', null)
    commit('SET_TOKEN', null)
    commit('newsfeed/clear', null, { root: true })
  },
  register ({dispatch, commit}, {email, password, inviteCode}) {
    return this.app.$api.service('users').create({email, password, inviteCode})
      .then(response => {
        return dispatch('login', {email, password})
      })
  },
  async patch ({state, commit, dispatch}, data) {
    // console.log('####################')
    // console.log('#AUTH/PATCH', data)
    // console.log('#USER ID', state.user._id)
    // console.log('#JWT TOKEN', this.$cookies.get(this.app.$api.authKey))
    // console.log('####################')
    // if (!state.isAuthenticated) {
    //   // stop when the user is not authenticated
    //   return
    // }
    const user = await this.app.$api.service('users').patch(state.user._id, data)
    commit('SET_USER', user)
    return user
  },
  verify ({dispatch}, verifyToken) {
    if (!verifyToken) { return false }
    return this.app.$api.service('authManagement').create({
      action: 'verifySignupLong',
      value: verifyToken
    })
      .then(() => {
        return true
      })
      .catch(err => {
        console.error(err.message, err)
      })
  },
  resendVerifySignup ({state, dispatch}) {
    if (!state.user.email) { return false }
    return this.app.$api.service('authManagement').create({
      action: 'resendVerifySignup',
      value: {
        email: state.user.email
      }
    })
      .then(() => {
        return true
      })
      .catch(err => {
        console.error(err.message, err)
      })
  }
}
