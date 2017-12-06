module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    "indent": ["error", 2],
    "semi": ["error", "never"],
    "eol-last": ["error", "always"],
    "linebreak-style": ["error", "unix"]
  },
  globals: {}
}
