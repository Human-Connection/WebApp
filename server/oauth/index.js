import { Router } from 'express'

import token from './token'

var router = Router()

// Add token Route
router.use(token)

export default router
