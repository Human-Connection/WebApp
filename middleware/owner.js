import feathers from '~plugins/feathers'

export default ({ redirect, params, route }) => {
  const serviceName = route.name.split('-')[0]
  // Call patch methods with empty data
  // If we get an error, we are not allowed to edit this
  return feathers.service(serviceName).patch(params.id, {})
    .catch((err) => {
      console.log(err.message)
      redirect('/')
    })
}
