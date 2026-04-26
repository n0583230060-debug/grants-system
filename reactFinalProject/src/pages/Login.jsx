import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import './Login.css'

const Login = () => {
    const [formData, setFormData] = useState({ idNumber: '', password: '' })
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
            const res = await API.post('/auth/login', formData)
            login(res.data.user, res.data.token)
            if (res.data.user.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/Dashboard')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'שגיאה בהתחברות')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div className="login-logo-circle">✦</div>
                </div>
                <h2 className="login-title">התחברות למערכת</h2>
                <p className="login-subtitle">ברוך הבא, הכנס את פרטיך להמשך</p>

                {error && <div className="login-error">{error}</div>}

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
                        <label className="login-label">סיסמה</label>
                        <input
                            className="login-input"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button className="login-btn" type="submit" disabled={loading}>
                        {loading ? 'מתחבר...' : 'התחברות'}
                    </button>
                </form>

                <p className="login-link">
                    אין לך חשבון? <Link to="/register">הירשם עכשיו</Link>
                </p>
            </div>
        </div>
    )
}

export default Login
