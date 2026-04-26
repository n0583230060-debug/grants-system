import jwt from 'jsonwebtoken'

// ==============================
// בדיקת טוקן — מגן על routes
// ==============================
export const verifyToken = (req, res, next) => {
    try {
        // שליפת הטוקן מה-header
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'אין טוקן, גישה נדחתה' })
        }

        // אימות הטוקן
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()

    } catch (err) {
        return res.status(401).json({ message: 'טוקן לא תקין' })
    }
}

// ==============================
// בדיקת הרשאת מנהל בלבד
// ==============================
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'גישה מותרת למנהל בלבד' })
        }
        next()
    })
}