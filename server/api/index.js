import { Router } from 'express'

import users from './users'
import contributions from './contributions'

const router = Router()

// Add USERS Routes
router.use(users)
router.use(contributions)

export default router
