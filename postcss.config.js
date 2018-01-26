module.exports = {
  plugins: {
    'postcss-cssnext': {
      browserslist: [
        '> 1%',
        'last 2 versions'
      ],
      features: {
        customProperties: false
      }
    }
  }
}
