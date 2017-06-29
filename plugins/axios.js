import * as axios from 'axios'

let options = {}
// The server-side needs a full url to works
if (process.SERVER_BUILD) {
  options.baseURL = `${process.env.baseURL}:${process.env.frontend.port}`
}

export default axios.create(options)
