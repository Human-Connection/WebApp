import createApiClient from '../helpers/createApiClient'

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

  const servicePlugins = requireModule.keys().map(modulePath => requireModule(modulePath).default(feathersClient))
  servicePlugins.forEach((servicePlugin) => {
    servicePlugin(store)
  })
}
