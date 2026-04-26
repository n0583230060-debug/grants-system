import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    if (!user) return (
         <header className="navbar">
            <div className="navbar-brand">
                <div className="navbar-dot" />
                מערכת מלגות
            </div>

            <div className="navbar-user">
                <button className="navbar-logout-btn" onClick={() => navigate('/login')}>התחבר</button>
                <button className="navbar-logout-btn" onClick={() => navigate('/register')}>הירשם</button>
            </div>
        </header>
    )

    return (
        <header className="navbar">
            <div className="navbar-brand">
                <div className="navbar-dot" />
                מערכת מלגות
            </div>

            <div className="navbar-user">
                <span className="navbar-user-name">שלום, {user?.firstName} {user?.lastName}</span>
                <button className="navbar-logout-btn" onClick={handleLogout}>התנתק</button>
            </div>
        </header>
    )
}

export default Navbar
