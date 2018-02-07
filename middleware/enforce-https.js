const redirectUrl = function (req, res) {
  if (req.method === 'GET') {
    res.redirect(301, process.env.BASE_URL + req.originalUrl)
  } else {
    res.status(403).send('Please use HTTPS when submitting data to this server.')
  }
}

module.exports = function () {
  return function enforceHTTPS (req, res, next) {
    if (!req.secure) {
      redirectUrl(req, res)
    } else {
      next()
    }
  }
}
