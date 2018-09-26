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
  SET_USER_SETTINGS (state, userSettings) {
    state.user = Object.assign(state.user, {
      userSettings: Object.assign(this.getters['auth/userSettings'], userSettings)
    })
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
  },
  userSettings (state, getters, rootState, rootGetters) {
    const userSettings = (state.user && state.user.userSettings) ? state.user.userSettings : {}

    const defaultLanguage = (state.user && state.user.language) ? state.user.language : rootGetters['i18n/locale']
    let contentLanguages = !isEmpty(userSettings.contentLanguages) ? userSettings.contentLanguages : []
    if (isEmpty(contentLanguages)) {
      contentLanguages = userSettings.uiLanguage ? [userSettings.uiLanguage] : [defaultLanguage]
    }

    return Object.assign({
      uiLanguage: defaultLanguage,
      contentLanguages: contentLanguages
    }, userSettings)
  }
}

export const actions = {
  async init ({commit, dispatch, state}) {
    let user
    // get fresh jwt token
    await dispatch('refreshJWT', 'auth/init')

    // check if the token is authenticated
    const isAuthenticated = await dispatch('checkAuth')
    if (isAuthenticated) {
      try {
        const payload = await this.app.$api.passport.verifyJWT(state.token)
        user = await this.app.$api.service('users').get(payload.userId)
      } catch (err) {
        user = null
      }
      commit('SET_USER', user)
    }
    return user
  },
  async refreshJWT ({state, getters, commit, dispatch}, source = null) {
    const token = await this.app.$api.passport.getJWT()
    commit('SET_TOKEN', token)

    if (process.env.NODE_ENV === 'development') {
      console.log('### refreshJWT', source, !isEmpty(token), getters.isAuthenticated)
    }

    let user
    if (token) {
      try {
        user = await this.app.$api.auth({strategy: 'jwt', accessToken: token})
      } catch (err) {
        user = null
      }
      commit('SET_USER', user)
    }
    dispatch('feathers-vuex-usersettings/loadCurrent', user, { root: true })
    return user
  },
  async checkAuth ({state, getters, commit, dispatch}) {
    if (!getters.user) {
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
      return false
    }

    const token = await this.app.$api.passport.getJWT()
    commit('SET_TOKEN', token)

    if (!token) {
      return false
    }
    let payloadValid = false
    try {
      const payload = await this.app.$api.passport.verifyJWT(token)
      payloadValid = this.app.$api.passport.payloadIsValid(payload)
    } catch (err) {
      payloadValid = false
    }
    if (payloadValid) {
      commit('SET_TOKEN', token)
    } else {
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
    }

    return payloadValid === true
  },
  async login ({commit, dispatch, getters}, {email, password}) {
    try {
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
      const user = await this.app.$api.auth({strategy: 'local', email, password})
      dispatch('feathers-vuex-usersettings/loadCurrent', user, { root: true })

      commit('SET_USER', user)

      try {
        const waitForUserSettings = () => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(getters.userSettings)
            }, 250)
          })
        }
        const locale = this.app.$cookies.get('locale')
        const userSettings = await waitForUserSettings()
        if (!isEmpty(locale) && user && userSettings && userSettings.uiLanguage !== locale) {
          // console.log('update user locale setting with cookie setting (had changed in on login screen)')
          // update user locale setting with cookie setting (had changed in on login screen)
          dispatch('usersettings/patch', {
            uiLanguage: locale
          }, { root: true })
        } else if (isEmpty(locale) && user && userSettings && userSettings.uiLanguage) {
          // console.log('set locale to user setting and persist in cookie')
          // set locale to user setting and persist in cookie
          this.app.$cookies.set('locale', userSettings.uiLanguage)
          this.app.$i18n.set(userSettings.uiLanguage)
        }
        commit('newsfeed/clear', null, { root: true })
      } catch (err) {
        console.error(err)
      }

      return user
    } catch (err) {
      commit('SET_USER', null)
      // commit('SET_TOKEN', null)
      throw new Error(err.message)
    }
  },
  async logout ({commit}) {
    this.app.router.push('/auth/logout')
  },
  register ({dispatch, commit}, {email, password, inviteCode, invitedByUserId}) {
    return this.app.$api.service('users').create({email, password, inviteCode, invitedByUserId, termsAndConditionsAccepted: new Date()})
      .then(response => {
        return dispatch('login', {email, password})
      })
  },
  async patch ({state, commit, dispatch}, data) {
    let user = state.user
    // console.log('####################')
    // console.log('#AUTH/PATCH', data)
    // console.log('#USER ID', state.user._id)
    // console.log('#JWT TOKEN', this.$cookies.get(this.app.$api.authKey))
    // console.log('#state.isAuthenticated', state.isAuthenticated)
    // console.log('#state.use', state.use)
    // console.log('####################')
    // if (!state.isAuthenticated || !user) {
    //   user = await dispatch('refreshJWT')
    // }
    if (!user) {
      // stop when the user is not authenticated
      console.error('stop when the user is not authenticated')
      throw new Error('NO USER')
    }
    user = await this.app.$api.service('users').patch(user._id, data)
    commit('SET_USER', user)
    return user
  },
  async refreshUser ({state, commit}, userSettings) {
    if (state.user && userSettings) {
      commit('SET_USER_SETTINGS', userSettings)
    } else if (state.user) {
      const user = await this.app.$api.service('users').get(state.user._id)
      commit('SET_USER', user)
      return user
    }
    return state.user
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
  },
  resetPassword ({state}, data) {
    return this.app.$api.service('authManagement').create({
      action: 'sendResetPwd',
      value: {
        email: data.email
      }
    })
      .then(() => {
        return true
      })
      .catch(err => {
        throw new Error(err.message)
      })
  },
  setNewPassword ({state}, data) {
    return this.app.$api.service('authManagement').create({
      action: 'resetPwdLong',
      value: {
        token: data.token,
        password: data.password
      }
    })
      .then(() => {
        return true
      })
      .catch(err => {
        throw new Error(err.message)
      })
  }
}
