
export default ({ app, params, route, error }, callback) => {
  const serviceName = route.name.split('-')[0]

  // Call patch methods with empty data
  // If we get an error, we are not allowed to edit this
  return app.$api.service(serviceName).patch(null, {}, {
    query: {
      slug: params.slug
    }
  })
    .then((res) => {
      // If we get an array back, we are allowed to edit
      if (res.length) return callback()
      // Otherwise we are not
      error({statusCode: 401, message: "You can't edit that!"})
    })
    .catch((err) => {
      error({statusCode: err.code || 500, message: err.message})
    })
}
