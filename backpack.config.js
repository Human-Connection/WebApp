module.exports = {
  webpack: (config, options, webpack) => {
    process.traceDeprecation = true
    config.entry.main = './server/index.js'
    return config
  }
}
