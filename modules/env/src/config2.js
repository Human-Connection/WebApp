import Vue from 'vue'
import { join } from 'path'

// const env = process.env.NODE_ENV
const env = 'production'

class Config {
  constructor (dir, files, isClient = process.client) {
    this.dir = dir
    this.isClient = !!isClient
    this.config = {}
    this.envUniversal = {}
    this.envServer = {}

    // load files
    files.universal.forEach((file) => this.__loadFile(file, 'envUniversal'))

    // load process vars
    this[this.__getRootKey()] = Object.assign(process.env, this[this.__getRootKey()])

    if (!this.isClient) {
      // add server vars only when not on client
      files.server.forEach((file) => this.__loadFile(file, 'envServer'))
      // load all env vars into server context too
      this.envServer = Object.assign(this.envUniversal, this.envServer)
    }
  }

  /**
   * add base vars and then overwrite them with the loaded ones
   * @param {Object} env
   */
  rebase (env) {
    this[this.__getRootKey()] = Object.assign(env, this[this.__getRootKey()])
    return this[this.__getRootKey()]
  }

  get (key) {
    return this[this.__getRootKey()][key] || process.env[key]
  }

  __loadFile (fileName, key) {
    const filePath = join(this.dir, fileName)
    console.log(filePath)

    if (this.isClient) {
      console.log('~/config/' + fileName + '.json')
      this[key] = Object.assign(this[key], require('../config/' + fileName + '.json'))
    } else {
      this[key] = Object.assign(this[key], require('../' + filePath + '.json'))
    }
  }

  __getRootKey () {
    return this.isClient ? 'envUniversal' : 'envServer'
  }
}

const dir = `config/`
const options = {
  universal: [
    'default',
    // 'build',
    `${env}`
  ],
  server: [
    `${env}-server`
  ]
}

Vue.mixin({ $conf: new Config(dir, options, true) })

// // export default config
// export default function (dir, options, isClient = process.client) {
//   dir = dir || `config/`
//   options = options || {
//     universal: [
//       'default',
//       // 'build',
//       `${env}`
//     ],
//     server: [
//       `${env}-server`
//     ]
//   }
//   return new Config(dir, options, isClient)
// }

export default ({ app }, inject) => {
  app.conf = new Config(dir, options, process.client)
}
