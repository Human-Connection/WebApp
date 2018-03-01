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
    return state.user && state.token
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
    await dispatch('refreshJWT')

    // check if the token is autenticated
    const isAuthenticated = await dispatch('checkAuth')
    if (isAuthenticated) {
      const payload = await this.app.$api.passport.verifyJWT(state.token)
      user = await this.app.$api.service('users').get(payload.userId)
      commit('SET_USER', user)
    }
    return user
  },
  async refreshJWT ({state, getters, commit}) {
    const token = await this.app.$api.passport.getJWT()
    commit('SET_TOKEN', token)

    let user
    if (token) {
      user = await this.app.$api.auth({strategy: 'jwt', accessToken: token})
    }
    return user
  },
  async jwt ({commit, dispatch, state}, {accessToken}) {
    // try {
    //   // await this.app.$api.logout()
    //   // this.app.$cookies.remove(this.app.$api.authKey)
    //   // const response = await this.app.$api.authenticate({strategy: 'jwt', accessToken})
    //   // const payload = await this.app.$api.passport.verifyJWT(response.accessToken)
    //   // const user = await this.app.$api.service('users').get(payload.userId)

    //   const user = await this.app.$api.auth({strategy: 'jwt', accessToken})

    //   commit('SET_USER', user)
    //   // commit('SET_TOKEN', response.accessToken)
    //   dispatch('notifications/fetch', null, { root: true })
    // } catch (err) {
    //   console.error('#auth/jwt')
    //   console.error(err.message, err)
    // }
  },
  async checkAuth ({state, getters, commit}) {
    const token = await this.app.$api.passport.getJWT()
    commit('SET_TOKEN', token)

    if (!token) {
      console.log('# checkAuth - token == null')
      return false
    }
    const payload = await this.app.$api.passport.verifyJWT(token)
    const payloadValid = this.app.$api.passport.payloadIsValid(payload)
    console.log('payloadValid', payloadValid)
    if (payloadValid) {
      console.log('# checkAuth - payloadValid == true')
      commit('SET_TOKEN', token)
    } else {
      console.log('# checkAuth - payloadValid == false')
      commit('SET_TOKEN', null)
      commit('SET_USER', null)
    }

    return payloadValid === true
    // console.log('this.app.$api.getJWT()', await this.app.$api.passport.getJWT())
    // try {
    //   console.log('this.app.$api.verifyJWT()', await this.app.$api.passport.verifyJWT(await this.app.$api.passport.getJWT()))
    // } catch (err) {
    //   console.error(err)
    // }
    // // commit('SET_TOKEN', this.$cookies.get(this.app.$api.authKey))
    // return getters.isAuthenticated
  },
  async login ({commit, dispatch}, {email, password}) {
    try {
      // await this.app.$api.logout()
      // this.app.$api.set('user', null)
      // commit('SET_USER', null)

      // const response = await this.app.$api.authenticate({strategy: 'local', email, password})
      // const payload = await this.app.$api.passport.verifyJWT(response.accessToken)
      // const user = await this.app.$api.service('users').get(payload.userId)

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
      console.error('#auth/login')
      console.error(err.message)
      commit('SET_USER', null)
      // commit('SET_TOKEN', null)
      throw new Error(err.message)
    }
  },
  async logout ({commit}) {
    if (await this.app.$api.passport.getJWT()) {
      await this.app.$api.logout()
    }
    commit('SET_USER', null)
    commit('newsfeed/clear', null, { root: true })

    // try {
    //   await this.app.$api.logout()
    // } catch (err) {
    //   console.error(err.message)
    // }
    // commit('SET_USER', null)
    // commit('SET_TOKEN', null)
    // this.app.$api.set('user', null)
    // this.app.$cookies.remove(this.app.$api.authKey)
    // commit('newsfeed/clear', null, { root: true })
    // dispatch('newsfeed/fetch', null, { root: true })
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
    // if (!state.user) {
    //   await dispatch('jwt', this.$cookies.get(this.app.$api.authKey))
    // }
    if (!state.user) {
      console.log('#EXIT - NO USER!')
      return
    }
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
  resendVerifySignup ({dispatch}, email) {
    if (!email) { return false }
    return this.app.$api.service('authManagement').create({
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
