import feathers from '~plugins/feathers'

export default ({ redirect, params, route }, callback) => {
  const serviceName = route.name.split('-')[0]
  // Call patch methods with empty data
  // If we get an error, we are not allowed to edit this
  return feathers.service(serviceName).patch(null, {}, {
    query: {
      slug: params.slug
    }
  })
    .then((res) => {
      // If we get an array back, we are allowed to edit
      if (res.length) return callback()
      // Otherwise we are not
      redirect('/')
    })
    .catch((err) => {
      console.log(err.message)
      redirect('/')
    })
}
