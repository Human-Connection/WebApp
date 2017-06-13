import axios from '~plugins/axios'

export default function ({isServer, req}) {
  if (isServer) {
    // if (req.headers.cookie) {
    //   axios.defaults.headers.common.cookie = req.headers.cookie
    // }

    // console.log(req.session)
    if (req.session && req.session.token) {
      axios.defaults.headers.common.authorization = `Bearer ${req.session.token}`
      // console.log('ADDING TOCKEN ' + req.session.token)
    }
  }
}
