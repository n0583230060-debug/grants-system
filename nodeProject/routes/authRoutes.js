import express from 'express'
import { register, login, forgotPassword, resetPassword } from '../controllers/auth.controller.js'

const router = express.Router()

// POST /api/auth/register — הרשמה
router.post('/register', register)

// POST /api/auth/login — התחברות
router.post('/login', login)

// POST /api/auth/forgot-password — שכחתי סיסמה
router.post('/forgot-password', forgotPassword)

// POST /api/auth/reset-password — איפוס סיסמה
router.post('/reset-password', resetPassword)

export default router