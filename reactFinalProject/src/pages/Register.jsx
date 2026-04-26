import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import './Register.css'

const Register = () => {
    const [formData, setFormData] = useState({ idNumber: '', firstName: '', lastName: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await API.post('/auth/register', formData)
            login(res.data.user, res.data.token)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'שגיאה בהרשמה')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-logo">
                    <div className="register-logo-circle">✦</div>
                </div>
                <h2 className="register-title">הרשמה למערכת</h2>
                <p className="register-subtitle">צור חשבון חדש להגשת בקשה</p>

                {error && <div className="register-error">{error}</div>}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="register-field">
                        <label className="register-label">מספר זהות</label>
                        <input className="register-input" type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} required />
                    </div>
                    <div className="register-field">
                        <label className="register-label">שם פרטי</label>
                        <input className="register-input" type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="register-field">
                        <label className="register-label">שם משפחה</label>
                        <input className="register-input" type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                    <div className="register-field">
                        <label className="register-label">סיסמה</label>
                        <input className="register-input" type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button className="register-btn" type="submit" disabled={loading}>
                        {loading ? 'נרשם...' : 'הרשמה'}
                    </button>
                </form>

                <p className="register-link">
                    כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link>
                </p>
            </div>
        </div>
    )
}

export default Register
