import feathersVuex from 'feathers-vuex'

let servicePlugin = (feathersClient) => {
  const { service } = feathersVuex(feathersClient, { idField: '_id' })
  const servicePath = 'usersettings'
  const servicePlugin = service(servicePath, {
    namespace: 'feathers-vuex-usersettings'
  })
  return servicePlugin
}
export default servicePlugin
