
export default async function ({ app, error, store, redirect, route }) {
  let isMaintenanceEnabled = false
  try {
    const res = await app.$api.service('status').find()
    isMaintenanceEnabled = res.maintenance === true
  } catch (err) {}
  if (isMaintenanceEnabled) {
    error({ statusCode: 503, message: 'Maintenance Mode' })
  }
}
