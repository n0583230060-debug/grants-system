 import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import grantRequestRoutes from './routes/grantRequest.routes.js'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => {
        console.error('MongoDB Error:', err)
        process.exit(1)
    })

app.get('/', (req, res) => {
    res.json({ message: 'השרת עובד!' })
})
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// שרת את תיקיית uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/auth', authRoutes)
app.use('/api/requests', grantRequestRoutes)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})