import feathers from '~/plugins/feathers'
import cookie from '~/helpers/ssr-storage'
import { isEmpty } from 'lodash'

export const state = () => {
  return {
    user: null,
    email: null,
    token: null
  }
}

export const mutations = {
  SET_USER (state, user) {
    if (!user || user === undefined) {
      state.user = null
      state.email = null
    } else {
      state.user = user
    }
  },
  SET_EMAIL (state, email) {
    if (!email || email === undefined) {
      state.email = null
    } else {
      state.email = email
    }
  },
  SET_TOKEN (state, token) {
    if (!token || token === undefined) {
      state.token = null
    } else {
      state.token = token
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
  isModerator (state) {
    return !!state.user && (state.user.role === 'admin' || state.user.role === 'moderator')
  },
  user (state) {
    return state.user
  },
  email (state) {
    return state.email
  },
  token (state) {
    return state.token
  }
}

export const actions = {
  async jwt ({commit, dispatch}, {accessToken}) {
    try {
      await feathers.logout()
      cookie.removeItem('feathers-jwt')
      cookie.removeItem('io')
      const response = await feathers.authenticate({strategy: 'jwt', accessToken})
      const payload = await feathers.passport.verifyJWT(response.accessToken)
      const user = await feathers.service('users').get(payload.userId)
      commit('SET_USER', user)
      commit('SET_TOKEN', response.accessToken)
      dispatch('notifications/fetch', null, { root: true })
    } catch (err) {
      console.error(err.message, err)
    }
  },
  async login ({commit, dispatch}, {email, password}) {
    try {
      await feathers.logout()
      cookie.removeItem('feathers-jwt')
      cookie.removeItem('io')
      commit('SET_USER', null)
      feathers.set('user', null)

      const response = await feathers.authenticate({strategy: 'local', email, password})
      const payload = await feathers.passport.verifyJWT(response.accessToken)
      const user = await feathers.service('users').get(payload.userId)
      const locale = cookie.getItem('locale')
      let saveLanguage = false
      if (user.language !== locale && !isEmpty(locale)) {
        user.language = locale
        saveLanguage = true
      }

      commit('SET_USER', user)
      commit('SET_EMAIL', email)
      commit('SET_TOKEN', response.accessToken)
      commit('newsfeed/clear', null, { root: true })

      if (saveLanguage) {
        dispatch('patch', {
          language: user.language
        })
      }
    } catch (err) {
      console.error(err.message)
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
      throw new Error(err.message)
    }
  },
  async logout ({commit, dispatch}) {
    try {
      await feathers.logout()
    } catch (err) {
      console.error(err.message)
    }
    commit('SET_USER', null)
    commit('SET_TOKEN', null)
    feathers.set('user', null)
    cookie.removeItem('feathers-jwt')
    cookie.removeItem('io')
    commit('newsfeed/clear', null, { root: true })
    // dispatch('newsfeed/fetch', null, { root: true })
  },
  register ({dispatch, commit}, {email, password, inviteCode}) {
    return feathers.service('users').create({email, password, inviteCode})
      .then(response => {
        commit('SET_EMAIL', email)
        return dispatch('login', {email, password})
      })
  },
  async patch ({state, commit}, data) {
    if (!state.user) {
      return null
    }
    const user = await feathers.service('users').patch(state.user._id, data)
    commit('SET_USER', user)
    return user
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
        console.error(err.message, err)
      })
  },
  resendVerifySignup ({dispatch}, email) {
    if (!email) { return false }
    return feathers.service('authManagement').create({
      action: 'resendVerifySignup',
      value: {
        email: email
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
