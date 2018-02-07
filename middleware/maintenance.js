import feathers from '~/plugins/feathers'

export default async function ({ error, store, redirect, route }) {
  let isMaintenanceEnabled = false
  try {
    const res = await feathers.service('status').find()
    isMaintenanceEnabled = res.maintenance === true
  } catch (err) {}
  if (isMaintenanceEnabled) {
    error({ statusCode: 503, message: 'Maintenance Mode' })
  }
}
