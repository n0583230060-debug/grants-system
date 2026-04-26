import GrantRequest from '../models/grantRequest.model.js'
import { sendRequestConfirmation, sendStatusUpdate } from '../services/email.service.js'
import User from '../models/user.model.js'

// ==============================
// הגשת בקשה חדשה
// ==============================
const parseField = (val) => {
    if (!val) return {}
    if (typeof val === 'object') return val
    try { return JSON.parse(val) } catch { return {} }
}

const parseBody = (body = {}) => ({
    personalDetails: parseField(body.personalDetails),
    familyDetails: parseField(body.familyDetails),
    studyDetails: parseField(body.studyDetails),
    bankDetails: parseField(body.bankDetails),
    email: body.email || ''
})

const buildDocuments = (files = []) => {
    const docs = {}
    for (const file of files) {
        docs[file.fieldname] = file.filename
    }
    return docs
}

export const submitRequest = async (req, res) => {
    try {
        const parsed = parseBody(req.body)
        const documents = buildDocuments(req.files)

        // בדיקה אם יש טיוטה קיימת — אם כן, נעדכן אותה
        const existingDraft = await GrantRequest.findOne({
            user: req.user.id,
            isDraft: true
        })

        if (existingDraft) {
            existingDraft.set({ ...parsed, documents, isDraft: false, submittedAt: Date.now() })
            await existingDraft.save()
            return res.status(200).json({
                message: 'הבקשה הוגשה בהצלחה!',
                request: existingDraft
            })
        }

        // יצירת בקשה חדשה
        const newRequest = new GrantRequest({
            ...parsed,
            documents,
            user: req.user.id,
            isDraft: false,
            status: 'pending',
            submittedAt: Date.now()
        })

        await newRequest.save()
        if (newRequest.email) {
            await sendRequestConfirmation(
                newRequest.email,
                newRequest.personalDetails.firstName
            )
        }

        return res.status(201).json({
            message: 'הבקשה הוגשה בהצלחה!',
            request: newRequest
        })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// ==============================
// שמירת טיוטה
// ==============================
export const saveDraft = async (req, res) => {
    try {
        // בדיקה אם כבר קיימת טיוטה למשתמש זה
        const existingDraft = await GrantRequest.findOne({
            user: req.user.id,
            isDraft: true
        })

        if (existingDraft) {
            // עדכון הטיוטה הקיימת
            existingDraft.set({ ...req.body })
            await existingDraft.save({ validateBeforeSave: false })
            return res.status(200).json({
                message: 'הטיוטה עודכנה בהצלחה!',
                draft: existingDraft
            })
        }

        // יצירת טיוטה חדשה
        const draft = new GrantRequest({
            ...req.body,
            user: req.user.id,
            isDraft: true,
            status: 'pending'
        })

        await draft.save({ validateBeforeSave: false })

        return res.status(201).json({
            message: 'הטיוטה נשמרה בהצלחה!',
            draft
        })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// ==============================
// שליפת טיוטה קיימת של המשתמש
// ==============================
export const getDraft = async (req, res) => {
    try {
        const draft = await GrantRequest.findOne({
            user: req.user.id,
            isDraft: true
        })

        if (!draft) {
            return res.status(404).json({ message: 'אין טיוטה שמורה' })
        }

        return res.status(200).json(draft)

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// ==============================
// צפייה בסטטוס הבקשה האחרונה של המשתמש
// ==============================
export const getMyRequestStatus = async (req, res) => {
    try {
        // שליפת הבקשה האחרונה שהוגשה (לא טיוטה)
        const request = await GrantRequest.findOne({
            user: req.user.id,
            isDraft: false
        }).sort({ submittedAt: -1 })

        if (!request) {
            return res.status(404).json({ message: 'לא נמצאה בקשה' })
        }

        // החזרת הסטטוס בלבד
        return res.status(200).json({
            status: request.status,
            submittedAt: request.submittedAt,
            message: getStatusMessage(request.status)
        })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// פונקציה עזר — הודעה לפי סטטוס
const getStatusMessage = (status) => {
    switch (status) {
        case 'pending': return 'בקשתך נמצאת בבדיקה'
        case 'approved': return 'בקשתך אושרה!'
        case 'rejected': return 'בקשתך נדחתה'
        default: return 'סטטוס לא ידוע'
    }
}

// ==============================
// סטטיסטיקות בקשות — למנהל בלבד
// ==============================
export const getRequestStats = async (req, res) => {
    try {
        const [total, pending, approved, rejected] = await Promise.all([
            GrantRequest.countDocuments({ isDraft: false }),
            GrantRequest.countDocuments({ isDraft: false, status: 'pending' }),
            GrantRequest.countDocuments({ isDraft: false, status: 'approved' }),
            GrantRequest.countDocuments({ isDraft: false, status: 'rejected' }),
        ])
        return res.status(200).json({ total, pending, approved, rejected })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// ==============================
// שליפת כל הבקשות — למנהל בלבד
// ==============================
export const getAllRequests = async (req, res) => {
    try {
        const {
            idNumber,
            fromDate,
            toDate,
            city,
            minTuition,
            maxTuition,
            siblingsOver18,
            siblingsUnder21
        } = req.query

        // בניית אובייקט פילטר דינמי
        const filter = { isDraft: false, status: { $ne: 'approved' } }

        if (idNumber) {
            filter['personalDetails.idNumber'] = idNumber
        }

        if (fromDate || toDate) {
            filter.submittedAt = {}
            if (fromDate) filter.submittedAt.$gte = new Date(fromDate)
            if (toDate) filter.submittedAt.$lte = new Date(toDate)
        }

        if (city) {
            filter['personalDetails.city'] = { $regex: city, $options: 'i' }
        }

        if (minTuition) {
            filter['studyDetails.annualTuition'] = { $gte: Number(minTuition) }
        }

        if (maxTuition) {
            filter['studyDetails.annualTuition'] = {
                ...filter['studyDetails.annualTuition'],
                $lte: Number(maxTuition)
            }
        }

        if (siblingsOver18) {
            filter['familyDetails.siblingsOver18'] = { $gte: Number(siblingsOver18) }
        }

        if (siblingsUnder21) {
            filter['familyDetails.siblingsUnder21'] = { $gte: Number(siblingsUnder21) }
        }

        // שליפה מה-DB — רק השדות הנדרשים לטבלה
        const requests = await GrantRequest.find(filter)
            .select('personalDetails.idNumber personalDetails.firstName personalDetails.lastName studyDetails.track status submittedAt')
            .sort({ submittedAt: -1 })

        return res.status(200).json(requests)

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// ==============================
// שליפת פרטי בקשה מלאה — למנהל
// ==============================
export const getRequestById = async (req, res) => {
    try {
        const request = await GrantRequest.findById(req.params.id)

        if (!request) {
            return res.status(404).json({ message: 'בקשה לא נמצאה' })
        }

        return res.status(200).json(request)

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// ==============================
// עדכון סטטוס בקשה — למנהל בלבד
// ==============================
export const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body

        // בדיקה שהסטטוס תקין
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'סטטוס לא תקין' })
        }

        const request = await GrantRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: 'after' }
        )

        if (!request) {
            return res.status(404).json({ message: 'בקשה לא נמצאה' })
        }

        if (request.email) {
            await sendStatusUpdate(
                request.email,
                request.personalDetails.firstName,
                status
            )
        }

        return res.status(200).json({
            message: `הבקשה ${status === 'approved' ? 'אושרה' : 'נדחתה'} בהצלחה!`,
            request
        })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}