const cookieName = 'feathers-jwt'

function getTokenFromRequest (req) {
  if (!req || !req.headers || !req.headers.cookie) return
  const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith(`${cookieName}=`))
  if (!jwtCookie) return
  return jwtCookie.split('=')[1]
}

export default function ({store, req}) {
  const accessToken = (process.server) ? getTokenFromRequest(req) : window.localStorage.getItem(cookieName)
  if (!accessToken) return

  return store.dispatch('auth/jwt', {accessToken})
    .catch((err) => {
      // Ignore invalid JWT
      console.error(err.message)
      console.error('#INVALID JWT TOKEN! ' + accessToken)

      store.dispatch('auth/logout', null, { root: true })
    })
}
