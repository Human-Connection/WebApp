module.exports = function (moduleOptions) {
  // Write your code here
  console.log('#EnvModule - INIT')

  // Add hook for build
  this.nuxt.hook('build:before', async builder => {
    // This will be called once when builder created
    console.log('#EnvModule - BUILD')

    // We can even register internal hooks here
    // builder.hook('compile', ({compiler}) => {
    //   console.log('#EnvModule - COMPILE')
    //   // This will be run just before webpack compiler starts
    // })
  })
}

// REQUIRED if publishing as an npm package
// module.exports.meta = require('./package.json')
