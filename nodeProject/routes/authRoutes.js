import express from 'express'
import { register, login } from '../controllers/auth.controller.js'

const router = express.Router()

// POST /api/auth/register — הרשמה
router.post('/register', register)

// POST /api/auth/login — התחברות
router.post('/login', login)

export default router