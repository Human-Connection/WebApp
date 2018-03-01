import request from 'request'

/**
 * middleware used to get avataaars from avataars.io through the server to avoid cors exceptions
 * and yes we tried the node proxy module but cloudflare does not like it at all
 *
 * @returns {Function}
 */

export default function () {
  return function (req, res) {
    return new Promise((resolve, reject) => {
      request(`https://avataaars.io${req.url}`, (err, result, body) => {
        if (err) {
          console.error(err)
          res.status(err.statusCode || 500).send(err.message)
          reject(err)
        } else {
          console.log(result)
          res.status(200).header('Content-Type', 'image/svg+xml').send(body)
          resolve()
        }
      })
    })
  }
}
