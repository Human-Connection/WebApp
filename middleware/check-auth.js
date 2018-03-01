// const cookieName = 'feathers-jwt'

// function getTokenFromRequest (req, authKey) {
//   if (!req || !req.headers || !req.headers.cookie) {
//     console.error('#check-auth/getTokenFromRequest - no cookies')
//     return
//   }
//   const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith(`${authKey}=`))
//   if (!jwtCookie) {
//     console.error('#check-auth/getTokenFromRequest - no jwt token')
//     return
//   }
//   return jwtCookie.split('=')[1]
// }

export default async ({store}) => {
  // await store.dispatch('auth/refreshJWT')

  console.log('WHAT THE FUCK IS HAPPENING?')

  if (process.client) {
    await store.dispatch('auth/refreshJWT')
  }

  await store.dispatch('auth/checkAuth')
  return true

  // const isAuthenticated = await store.dispatch('auth/checkAuth')
  // return isAuthenticated === true
  // // const accessToken = getTokenFromRequest(req, app.$api.authKey)
  // const accessToken = app.$cookies.get(app.$api.authKey)
  // console.log('<<<<<<<<<<<', accessToken)
  // // const accessToken = app.$cookies.get(app.$api.authKey)
  // if (!accessToken) {
  //   console.error('#check-auth/accessToken - no access token')
  //   console.log(typeof app.$cookies)
  //   console.log(typeof app.$api)
  //   console.log(app.$cookies.get(app.$api.authKey))
  //   console.log(app.$api.authKey)
  // } else {
  //   await store.dispatch('auth/jwt', {accessToken})
  // }
  // return !!store.getters['auth/token']
}
