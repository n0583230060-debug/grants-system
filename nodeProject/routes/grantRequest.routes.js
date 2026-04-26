import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import {
    submitRequest,
    saveDraft,
    getDraft,
    getMyRequestStatus,
    getAllRequests,
    getRequestById,
    updateRequestStatus,
    getRequestStats
} from '../controllers/grantRequest.controller.js'
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename:    (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})
const upload = multer({ storage })

const router = express.Router()

// ==============================
// routes של סטודנט — דורשים טוקן
// ==============================

// הגשת בקשה חדשה
router.post('/submit', verifyToken, upload.any(), submitRequest)

// שמירת טיוטה
router.post('/draft', verifyToken, saveDraft)

// שליפת טיוטה קיימת
router.get('/draft', verifyToken, getDraft)

// צפייה בסטטוס הבקשה שלי
router.get('/my-status', verifyToken, getMyRequestStatus)

// ==============================
// routes של מנהל — דורשים הרשאת admin
// ==============================

// סטטיסטיקות בקשות
router.get('/stats', verifyAdmin, getRequestStats)

// שליפת כל הבקשות עם פילטרים
router.get('/all', verifyAdmin, getAllRequests)

// שליפת פרטי בקשה מלאה
router.get('/:id', verifyAdmin, getRequestById)

// עדכון סטטוס בקשה
router.patch('/:id/status', verifyAdmin, updateRequestStatus)

export default router