import Vue from 'vue'
import Vuex from 'vuex'
import createApiClient from '../helpers/createApiClient'
import feathersVuex from 'feathers-vuex'

const requireModule = require.context(
  // The relative path holding the service modules
  '../store/services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports)
  /.js$/
)

export default async ({app, store, req, res}) => {
  const feathersClient = createApiClient({app, req, res})
  const { FeathersVuex } = feathersVuex(feathersClient, { idField: '_id' })

  Vue.use(FeathersVuex)
  Vue.use(Vuex)

  const servicePlugins = requireModule.keys().map(modulePath => requireModule(modulePath).default(feathersClient))
  servicePlugins.forEach((servicePlugin) => {
    servicePlugin(store)
  })
}
