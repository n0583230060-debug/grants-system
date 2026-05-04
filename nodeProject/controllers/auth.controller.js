import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { sendPasswordResetCode } from '../services/email.service.js'

// הרשמה
export const register = async (req, res) => {
    try {
        const { idNumber, firstName, lastName, password } = req.body

        // בדיקה שכל השדות קיימים
        if (!idNumber || !firstName || !lastName || !password) {
            return res.status(400).json({ message: 'כל השדות הם חובה' })
        }

        // בדיקה שהמשתמש לא קיים כבר
        const existingUser = await User.findOne({ idNumber })
        if (existingUser) {
            return res.status(400).json({ message: 'משתמש עם מ.ז זה כבר קיים' })
        }

        // יצירת משתמש חדש — הסיסמה תוצפן אוטומטית בmiddleware של המודל
        const user = new User({ idNumber, firstName, lastName, password })
        await user.save()

        // יצירת טוקן
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        return res.status(201).json({
            message: 'נרשמת בהצלחה!',
            token,
            user: {
                id: user._id,
                idNumber: user.idNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


// התחברות
export const login = async (req, res) => {
    try {
        const { idNumber, password } = req.body

        // בדיקה שהשדות קיימים
        if (!idNumber || !password) {
            return res.status(400).json({ message: 'מ.ז וסיסמה הם חובה' })
        }

        // חיפוש המשתמש ב-DB
        const user = await User.findOne({ idNumber })
        if (!user) {
            return res.status(401).json({ message: 'מ.ז או סיסמה שגויים' })
        }

        // בדיקת סיסמה
        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'מ.ז או סיסמה שגויים' })
        }

        // יצירת טוקן
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        return res.status(200).json({
            message: 'התחברת בהצלחה!',
            token,
            user: {
                id: user._id,
                idNumber: user.idNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// שכחתי סיסמה — שליחת קוד אימות למייל
export const forgotPassword = async (req, res) => {
    try {
        const { idNumber, email } = req.body

        if (!idNumber || !email) {
            return res.status(400).json({ message: 'מ.ז ואימייל הם חובה' })
        }

        const user = await User.findOne({ idNumber })
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' })
        }

        // יצירת קוד אימות 6 ספרות
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

        // שמירת הטוקן והקוד במשתמש עם תוקף של 15 דקות
        user.resetToken = resetToken
        user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000)
        user.email = email
        
        // שמירת קוד האימות בצורה מוצפנת בזכרון (בפרקטיקה אמיתית, צריך לשמור בDB)
        // לצורך פשטות, נשמור אותו בצורה מזמנית בserver
        global.resetCodes = global.resetCodes || {}
        global.resetCodes[resetToken] = {
            code: resetCode,
            expiry: user.resetTokenExpiry,
            idNumber: idNumber
        }

        await user.save()

        // שליחת קוד למייל
        await sendPasswordResetCode(email, user.firstName, resetCode)

        return res.status(200).json({
            message: 'קוד אימות נשלח למייל שלך',
            resetToken // נשלח ללקוח כדי שיוכל להשתמש בו לאימות ולאיפוס
        })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// אימות קוד ואיפוס סיסמה
export const resetPassword = async (req, res) => {
    try {
        const { resetToken, code, newPassword } = req.body

        if (!resetToken || !code || !newPassword) {
            return res.status(400).json({ message: 'כל השדות הם חובה' })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'סיסמה חייבת להיות לפחות 6 תווים' })
        }

        // בדיקת הקוד
        const resetData = global.resetCodes?.[resetToken]
        if (!resetData) {
            return res.status(400).json({ message: 'קישור איפוס סיסמה לא תקף או פג תוקפו' })
        }

        if (new Date() > resetData.expiry) {
            delete global.resetCodes[resetToken]
            return res.status(400).json({ message: 'קוד האימות פג תוקפו' })
        }

        if (resetData.code !== code) {
            return res.status(400).json({ message: 'קוד אימות שגוי' })
        }

        // חיפוש המשתמש ועדכון הסיסמה
        const user = await User.findOne({ idNumber: resetData.idNumber })
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' })
        }

        user.password = newPassword
        user.resetToken = null
        user.resetTokenExpiry = null
        await user.save()

        // ניקוי הקוד מהזיכרון
        delete global.resetCodes[resetToken]

        return res.status(200).json({
            message: 'סיסמה שונתה בהצלחה!'
        })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}