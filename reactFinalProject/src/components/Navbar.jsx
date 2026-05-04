import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import SettingsModal from './SettingsModal'
import './Navbar.css'

const Navbar = () => {
    const { user, logout } = useAuth()
    const { isDarkMode } = useTheme()
    const navigate = useNavigate()
    const [showSettings, setShowSettings] = useState(false)

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
                <button className="navbar-settings-btn" onClick={() => setShowSettings(true)}>
                    ⚙️
                </button>
                <button className="navbar-logout-btn" onClick={() => navigate('/login')}>התחבר</button>
                <button className="navbar-logout-btn" onClick={() => navigate('/register')}>הירשם</button>
            </div>

            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </header>
    )

    return (
        <header className="navbar">
            <div className="navbar-brand">
                <div className="navbar-dot" />
                מערכת מלגות
            </div>

            <div className="navbar-user">
                <button className="navbar-settings-btn" onClick={() => setShowSettings(true)}>
                    ⚙️
                </button>
                <span className="navbar-user-name">שלום, {user?.firstName} {user?.lastName}</span>
                <button className="navbar-logout-btn" onClick={handleLogout}>התנתק</button>
            </div>

            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </header>
    )
}

export default Navbar
