module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  env: {
    jest: true,
    browser: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:vue/recommended'
  ],
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
