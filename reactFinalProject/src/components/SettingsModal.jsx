import { useTheme } from '../context/ThemeContext'
import './SettingsModal.css'

const SettingsModal = ({ isOpen, onClose }) => {
    const { isDarkMode, toggleTheme } = useTheme()

    if (!isOpen) return null

    return (
        <div className="settings-modal-overlay" onClick={onClose}>
            <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                <div className="settings-modal-header">
                    <h3>הגדרות תצוגה</h3>
                    <button className="settings-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="settings-modal-content">
                    <div className="setting-item">
                        <label className="setting-label">מצב תצוגה</label>
                        <div className="theme-toggle">
                            <button
                                className={`theme-btn ${!isDarkMode ? 'active' : ''}`}
                                onClick={() => !isDarkMode || toggleTheme()}
                            >
                                בהיר
                            </button>
                            <button
                                className={`theme-btn ${isDarkMode ? 'active' : ''}`}
                                onClick={() => isDarkMode || toggleTheme()}
                            >
                                כהה
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsModal