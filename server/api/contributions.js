import { Router } from 'express'
import axios from 'axios'

const router = Router()

router.get('/contributions', async function (req, res, next) {
  try {
    const {data} = await axios.get('http://localhost:3030/contributions')
    res.json(data)
  } catch (error) {
    res.json({})
    res.status(500).json({message: error.message})
  }
})

router.get('/contributions/:slug', async function (req, res, next) {
  try {
    const {data} = await axios.get(`http://localhost:8000/api/contribution/${req.params.slug}`)
    res.json(data)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

// router.get('/blabla', function (req, res, next) {
//   console.log('#ROUTE PARAMETER')
//   console.log(req.params)
//   res.status(201).json({slug: req.params})
//   // try {
//   //   const {data} = await axios.get(`http://localhost:8000/api/contribution/${req.params.slug}`)
//   //   res.json(data)
//   // } catch (error) {
//   //   res.status(500).json({message: error.message})
//   // }
// })

export default router
