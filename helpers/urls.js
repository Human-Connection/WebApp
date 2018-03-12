import { merge, parseInt } from 'lodash'

export const buildEndpointURL = (host, options = {}) => {
  options = merge({ protocol: 'http', port: null }, options || {})
  let endpoint = host

  if (host.indexOf('://') < 0 && options.protocol) {
    endpoint = `${options.protocol}://${endpoint}`
  }

  if (parseInt(options.port) > 0 && parseInt(options.port) !== 443 && parseInt(options.port) !== 80) {
    endpoint = `${endpoint}:${options.port}`
  }
  return endpoint
}

export const buildUserUrl = (slug) => {
  return `${process.env.WEBAPP_BASE_URL}/profile/${slug}`
}

export const buildContributionUrl = (slug) => {
  return `${process.env.WEBAPP_BASE_URL}/contributions/${slug}`
}

export default {
  buildEndpointURL,
  buildUserUrl,
  buildContributionUrl
}
