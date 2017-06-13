export default {
  nuxtServerInit ({commit}, {req}) {
    // TODO: to make the session sticky we need to add a different express-session store like redis or a like
    console.log('SERVER INIT')
    console.log(req.session)
    if (req.session && req.session.user) {
      commit('SET_USER', req.session.user)
    }
  }
}
