import test from 'ava'
import urlHelper from '../helpers/urls'

/**
 * Testing the url helper
 */

test('URL Helper Test', t => {
  t.is(urlHelper.buildEndpointURL('localhost'), 'http://localhost')
  t.is(urlHelper.buildEndpointURL('localhost', { port: 3030 }), 'http://localhost:3030')
  t.is(urlHelper.buildEndpointURL('localhost', { protocol: 'https' }), 'https://localhost')
  t.is(urlHelper.buildEndpointURL('localhost', { protocol: 'https', port: 3030 }), 'https://localhost:3030')
  t.is(urlHelper.buildEndpointURL('localhost', { protocol: null }), 'localhost')

  t.is(urlHelper.buildEndpointURL('https://api.human-connection.org'), 'https://api.human-connection.org')
  t.is(urlHelper.buildEndpointURL('http://api.human-connection.org'), 'http://api.human-connection.org')
  t.is(urlHelper.buildEndpointURL('https://api.human-connection.org', { port: 443 }), 'https://api.human-connection.org')
  t.is(urlHelper.buildEndpointURL('http://api.human-connection.org', { port: 80 }), 'http://api.human-connection.org')
  t.is(urlHelper.buildEndpointURL('https://api.human-connection.org', { port: 3030 }), 'https://api.human-connection.org:3030')
  t.is(urlHelper.buildEndpointURL('https://api.human-connection.org', { port: undefined }), 'https://api.human-connection.org')
  t.is(urlHelper.buildEndpointURL('https://api.human-connection.org', { port: null }), 'https://api.human-connection.org')
  t.is(urlHelper.buildEndpointURL('https://api.human-connection.org', { port: '' }), 'https://api.human-connection.org')
  t.is(urlHelper.buildEndpointURL('https://api.human-connection.org', { port: ' ' }), 'https://api.human-connection.org')
})
