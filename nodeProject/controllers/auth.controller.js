import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

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