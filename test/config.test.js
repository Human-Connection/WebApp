import test from 'ava'
import config from '../plugins/config'

/**
 * Testing the Config Loader
 */

test('Config Loader Test', t => {
  let env = 'production'
  let files = {
    universal: [
      'default',
      `${env}`
    ],
    server: [
      'default',
      `${env}-secrets`
    ]
  }
  const configUniversal = config(`test/config/`, files, true)

  t.is(configUniversal.get('envVar0'), 'default')
  t.is(configUniversal.get('envVar1'), 'client')
  t.is(configUniversal.get('envVar2'), 'client')
  t.is(configUniversal.get('envVarOnlyServer'), undefined)

  const configServer = config(`test/config/`, files)
  t.is(configServer.get('envVar0'), 'default')
  t.is(configServer.get('envVar1'), 'server')
  t.is(configServer.get('envVar2'), 'server')
  t.is(configServer.get('envVarOnlyServer'), 'server')
})
