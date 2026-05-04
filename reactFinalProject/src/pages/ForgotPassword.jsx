import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import './Login.css'

const ForgotPassword = () => {
    const [step, setStep] = useState('enter-details') // enter-details, success
    const [formData, setFormData] = useState({ idNumber: '', email: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [resetToken, setResetToken] = useState(null)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await API.post('/auth/forgot-password', formData)
            setResetToken(res.data.resetToken)
            setStep('success')
        } catch (err) {
            setError(err.response?.data?.message || 'שגיאה בשליחת קוד')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div className="login-logo-circle">🔐</div>
                </div>
                <h2 className="login-title">איפוס סיסמה</h2>
                <p className="login-subtitle">הכנס את פרטיך כדי לקבל קוד אימות</p>

                {error && <div className="login-error">{error}</div>}

                {step === 'enter-details' && (
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="login-field">
                            <label className="login-label">מספר זהות</label>
                            <input
                                className="login-input"
                                type="text"
                                name="idNumber"
                                value={formData.idNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="login-field">
                            <label className="login-label">אימייל</label>
                            <input
                                className="login-input"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button className="login-btn" type="submit" disabled={loading}>
                            {loading ? 'שולח...' : 'שלח קוד אימות'}
                        </button>
                    </form>
                )}

                {step === 'success' && (
                    <div className="success-message">
                        <div className="success-icon">✓</div>
                        <p className="success-text">קוד אימות נשלח למייל שלך!</p>
                        <p className="success-subtext">בדוק את תיבת הדואר שלך (וגם Spam) כדי לקבל את הקוד</p>
                        <button
                            className="login-btn"
                            onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                        >
                            המשך לאיפוס סיסמה
                        </button>
                    </div>
                )}

                <p className="login-link">
                    <Link to="/login">חזור להתחברות</Link>
                </p>
            </div>
        </div>
    )
}

export default ForgotPassword