import feathersVuex from 'feathers-vuex'

let servicePlugin = (feathersClient) => {
  const { service } = feathersVuex(feathersClient, { idField: '_id' })
  const servicePath = 'users'
  const servicePlugin = service(servicePath, {
    namespace: 'feathers-vuex-users'
  })
  return servicePlugin
}
export default servicePlugin
