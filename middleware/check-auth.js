const cookieName = 'feathers-jwt'

function getTokenFromRequest (req) {
  if (!req || !req.headers || !req.headers.cookie) return
  const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith(`${cookieName}=`))
  if (!jwtCookie) return
  console.log('#TOKEn? ' + (jwtCookie.split('=')[1]))
  return jwtCookie.split('=')[1]
}

export default function ({isServer, store, req}) {
  const accessToken = (isServer) ? getTokenFromRequest(req) : window.localStorage.getItem(cookieName)
  if (!accessToken) return

  return store.dispatch('auth/jwt', {accessToken})
    .catch((err) => {
      // Ignore invalid JWT
      console.error(err.message)
      console.error('#INVALID JWT TOKEN! ' + accessToken)
    })
}
