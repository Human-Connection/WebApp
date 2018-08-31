
export default async function ({ app, error, store, redirect, route }) {
  let isMaintenanceEnabled = false
  if (Boolean(app.$env.MAINTENANCE) === true) {
    error({ statusCode: 503, message: 'Maintenance Mode' })
    return
  }
  try {
    const res = await app.$api.service('status').find()
    isMaintenanceEnabled = res.maintenance === true
  } catch (err) {}
  if (isMaintenanceEnabled) {
    error({ statusCode: 503, message: 'Maintenance Mode' })
  }
}
