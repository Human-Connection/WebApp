export default {
  SET_TOKEN: (state, {token}) => {
    state.token = token
  },
  SET_USER: function (state, user) {
    console.log('SET_USER')
    console.log(user)
    state.user = user
  }
}
