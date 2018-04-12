import request from 'request'

export default function () {
  return function (req, res) {
    return new Promise((resolve, reject) => {
      request({
        url: `${process.env.EMBED_API_URL}${req.url}`,
        headers: {
          'authentication': process.env.EMBED_API_TOKEN
        }
      }, (err, result, body) => {
        if (err) {
          res.status(err.statusCode || 500).send(err.message)
          reject(err)
        } else {
          res.status(200).send(body)
          resolve()
        }
      })
    })
  }
}
