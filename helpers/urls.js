import { merge } from 'lodash'

export default {
  buildEndpointURL (host, options = {}) {
    options = merge({ protocol: 'http', port: null }, options || {})
    let endpoint = host
    if (host.indexOf('://') < 0 && options.protocol) {
      endpoint = `${options.protocol}://${endpoint}`
    }
    if (options.port > 0 && options.port !== 443 && options.port !== 80) {
      endpoint = `${endpoint}:${options.port}`
    }
    return endpoint
  }
}
