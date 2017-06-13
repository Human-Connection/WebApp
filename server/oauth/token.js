import { Router } from 'express'
import axios from 'axios'

const router = Router()

router.post('/login', async function (req, res, next) {

  console.log(req.body)
  console.log(req.session.token)

  const env = require('../../env.js')
  console.log(`${env.oAuth.endpoint}/oauth/token`)
  console.log(`${env.api.endpoint}/api/profile`)

  try {
    const oAuthRes = await axios.post(`${env.oAuth.endpoint}/oauth/token`, {
      'username': req.body.username,
      'password': req.body.password,
      'grant_type': 'password',
      'client_id': env.oAuth.clientId,
      'client_secret': env.oAuth.secret
    })

    // save the token to the session for use in the next requests
    if (oAuthRes.data.access_token) {
      req.session.token = oAuthRes.data.access_token
      req.session.save(function (error) {
        console.log('SAVING TOKEN TO SESSION')
        console.log(req.session.token)
        console.log(error)

      })
      console.log('SAVED TOKEN TO SESSION')
    }
    // get user
    const userRes = await axios.get(`${env.api.endpoint}/api/profile`, {
      headers: {
        authorization: `Bearer ${req.session.token}`
      }
    })
    if (userRes.data) {
      req.session.user = userRes.data
      req.session.save()
    }
    console.log('USER:')
    console.log(userRes.data)

    res.status(200).json({
      data: {
        user: userRes.data
      }
    })
  } catch (error) {
    console.log(error.message)
    res.status(401).json({message: 'ERROR OCCURED!'})
  }

})

router.post('/logout', function (req, res, next) {
  req.session.destroy()
  res.status(200).json({message: 'you are loggedout!'})
})

export default router
