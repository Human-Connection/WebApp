import feathersVuex, { initAuth } from 'feathers-vuex'
import createApiClient from '../helpers/createApiClient'
import Vuex from 'vuex'

import auth from './auth'
import categories from './categories'
import comments from './comments'
import connections from './connections'
import layout from './layout'
import newsfeed from './newsfeed'
import notifications from './notifications'
import organizations from './organizations'
import search from './search'
import settings from './settings'
import usersettings from './usersettings'

const requireModule = require.context(
  // The relative path holding the service modules
  './services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports)
  /.js$/
)

const createStore = (ssrContext) => {
  const feathersClient = createApiClient(ssrContext || {})
  const { auth: feathersVuexAuthentication } = feathersVuex(feathersClient, { idField: '_id' })
  const servicePlugins = requireModule.keys().map(modulePath => requireModule(modulePath).default(feathersClient))

  return new Vuex.Store({
    modules: { auth, categories, comments, connections, layout, newsfeed, notifications, organizations, search, settings, usersettings },
    actions: {
      async nuxtServerInit ({dispatch, commit}, {req}) {
        dispatch('categories/init')
        await dispatch('auth/init')
        await dispatch('settings/init')
        return initAuth({
          commit,
          dispatch,
          req,
          moduleName: 'auth',
          cookieName: 'feathers-jwt'
        })
      }
    },
    plugins: [
      ...servicePlugins,
      feathersVuexAuthentication({
        userService: 'users',
        state: {
          publicPages: [
            'auth-login',
            'auth-register',
            'auth-signup',
            'auth-reset',
            'auth-reset-token',
            'pages-slug',
            'test'
          ]
        }
      })
    ]
  })
}

export default createStore
