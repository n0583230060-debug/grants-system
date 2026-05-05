import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api/axios"
import './ViewStatus.css'

const STATUS_MAP = {
    approved: { badge: 'view-status-badge--approved', label: 'אושר',  text: 'בקשתך אושרה!' },
    rejected: { badge: 'view-status-badge--rejected', label: 'נדחה',  text: 'בקשתך נדחתה' },
    pending:  { badge: 'view-status-badge--pending',  label: 'ממתין', text: 'בקשתך נמצאת בבדיקה' },
}

const ViewStatus = () => {
    const navigate = useNavigate()
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [sendingEmail, setSendingEmail] = useState(false)
    const [emailSuccess, setEmailSuccess] = useState(false)

    useEffect(() => {
        const loadStatus = async () => {
            try {
                const res = await API.get('/requests/my-status')
                if (res.data) setStatus(res.data)
            } catch (err) {
                if (err.response?.status === 404) {
                    setStatus(null)
                } else {
                    setError('שגיאה בטעינת הסטטוס')
                }
            } finally {
                setLoading(false)
            }
        }
        loadStatus()
    }, [])

    const handleSendEmail = async () => {
        setSendingEmail(true)
        setError('')
        try {
            await API.post('/requests/send-status-email')
            setEmailSuccess(true)
            setTimeout(() => setEmailSuccess(false), 3000)
        } catch (err) {
            setError(err.response?.data?.message || 'שגיאה בשליחת האימייל')
        } finally {
            setSendingEmail(false)
        }
    }

    const s = status?.status
    const { badge, label, text } = STATUS_MAP[s] ?? { badge: 'view-status-badge--pending', label: 'ממתין', text: 'בקשתך נמצאת בבדיקה' }

    return (
        <div className="view-status-page">
            <button className="send-request-back-btn" onClick={() => navigate('/dashboard')}>← חזרה</button>
            <h2 className="view-status-title">סטטוס הבקשה</h2>
            <div className="view-status-card">
                {loading && <p className="view-status-loading">טוען...</p>}
                {error && <p className="view-status-error">{error}</p>}
                {!loading && !error && !status && <p className="view-status-empty">לא נמצאה בקשה</p>}
                {!loading && !error && status && (
                    <>
                        <div className={`view-status-badge ${badge}`}>{label}</div>
                        <p className="view-status-text">{text}</p>
                        <button 
                            className="view-status-email-btn" 
                            onClick={handleSendEmail}
                            disabled={sendingEmail}
                        >
                            {sendingEmail ? 'שולח...' : '📧 שלח סטטוס למייל'}
                        </button>
                        {emailSuccess && <p className="view-status-success">סטטוס נשלח בהצלחה!</p>}
                    </>
                )}
            </div>
        </div>
    )
}

export default ViewStatus
