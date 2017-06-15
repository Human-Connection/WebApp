import { Router } from 'express'
import axios from 'axios'
import env from '../../env'

const router = Router()

router.get('/contributions', async function (req, res, next) {
  try {
    const {data} = await axios.get(`${env.api.endpoint}/api/contribution/list`)
    res.json(data)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

router.get('/contributions/:slug', async function (req, res, next) {
  const slug = req.params.slug || req.params
  const url = `${env.api.endpoint}/api/contribution/${slug}`
  console.log(process)
  console.log(url)
  try {
    const {data} = await axios.get(url)
    res.json(data)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

router.post('/contributions', async function (req, res, next) {
  try {
    const {data} = await axios.post(`${env.api.endpoint}/api/contribution`)
    res.json(data)
  } catch (error) {
    console.error(error.response.data.message)
    res.status(500).json({
      message: error.message,
      data: error.response.data.message
    })
  }
})

export default router
