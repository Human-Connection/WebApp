export default {
  SET_TOKEN: (state, {token}) => {
    state.token = token
  },
  SET_USER: function (state, user) {
    console.log('SET_USER', user)
    if (user) {
      state.user = user
    } else {
      state.user = null
      state.token = null
    }
  }
}
