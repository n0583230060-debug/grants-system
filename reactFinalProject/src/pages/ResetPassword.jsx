import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import API from '../api/axios'
import './Login.css'

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const [formData, setFormData] = useState({ code: '', newPassword: '', confirmPassword: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showPasswords, setShowPasswords] = useState(false)
    const navigate = useNavigate()

    const resetToken = searchParams.get('token')

    useEffect(() => {
        if (!resetToken) {
            setError('קישור לא תקף. אנא בקש איפוס סיסמה חדש.')
        }
    }, [resetToken])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.newPassword !== formData.confirmPassword) {
            setError('הסיסמאות לא תואמות')
            return
        }

        if (formData.newPassword.length < 6) {
            setError('סיסמה חייבת להיות לפחות 6 תווים')
            return
        }

        setLoading(true)
        try {
            await API.post('/auth/reset-password', {
                resetToken,
                code: formData.code,
                newPassword: formData.newPassword
            })
            setSuccess(true)
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            setError(err.response?.data?.message || 'שגיאה באיפוס סיסמה')
        } finally {
            setLoading(false)
        }
    }

    if (!resetToken) {
        return (
            <div className="login-page">
                <div className="login-card">
                    <h2 className="login-title">שגיאה</h2>
                    <div className="login-error">{error}</div>
                    <p className="login-link">
                        <Link to="/forgot-password">בקש איפוס סיסמה חדש</Link>
                    </p>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="login-page">
                <div className="login-card">
                    <div className="login-logo">
                        <div className="login-logo-circle">✓</div>
                    </div>
                    <h2 className="login-title">סיסמה שונתה בהצלחה!</h2>
                    <p className="login-subtitle">מעביר אותך להתחברות...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div className="login-logo-circle">🔑</div>
                </div>
                <h2 className="login-title">איפוס סיסמה</h2>
                <p className="login-subtitle">הכנס את קוד האימות וסיסמה חדשה</p>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-field">
                        <label className="login-label">קוד אימות (6 ספרות)</label>
                        <input
                            className="login-input"
                            type="text"
                            name="code"
                            placeholder="000000"
                            value={formData.code}
                            onChange={handleChange}
                            maxLength="6"
                            required
                        />
                        <p className="reset-hint">הקוד נשלח לאימייל שלך</p>
                    </div>

                    <div className="login-field">
                        <label className="login-label">סיסמה חדשה</label>
                        <div className="password-input-wrapper">
                            <input
                                className="login-input"
                                type={showPasswords ? 'text' : 'password'}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPasswords(!showPasswords)}
                            >
                                {showPasswords ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <div className="login-field">
                        <label className="login-label">אימות סיסמה</label>
                        <input
                            className="login-input"
                            type={showPasswords ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="login-btn" type="submit" disabled={loading}>
                        {loading ? 'משנה סיסמה...' : 'שנה סיסמה'}
                    </button>
                </form>

                <p className="login-link">
                    <Link to="/login">חזור להתחברות</Link>
                </p>
            </div>
        </div>
    )
}

export default ResetPassword