import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import './Dashboard.css'

const AdminDashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 })

    useEffect(() => {
        API.get('/requests/stats')
            .then(res => setStats(res.data))
            .catch(() => {})
    }, [])

    return (
        <div className="dashboard-page">
            <div className="dashboard-body">
                <div className="dashboard-welcome">
                    <h2 className="dashboard-welcome-title">ברוך הבא, {user?.firstName}</h2>
                    <p className="dashboard-welcome-sub">לוח בקרה — מנהל מערכת</p>
                </div>

                <div className="admin-stats">
                    <div className="admin-stat-card">
                        <span className="admin-stat-num">{stats.total}</span>
                        <span className="admin-stat-label">סה"כ בקשות</span>
                    </div>
                    <div className="admin-stat-card">
                        <span className="admin-stat-num admin-stat-num--pending">{stats.pending}</span>
                        <span className="admin-stat-label">ממתינות</span>
                    </div>
                    <div className="admin-stat-card">
                        <span className="admin-stat-num admin-stat-num--approved">{stats.approved}</span>
                        <span className="admin-stat-label">מאושרות</span>
                    </div>
                    <div className="admin-stat-card">
                        <span className="admin-stat-num admin-stat-num--rejected">{stats.rejected}</span>
                        <span className="admin-stat-label">נדחות</span>
                    </div>
                </div>

                <div className="dashboard-cards">
                    <button className="dashboard-card" onClick={() => navigate('/admin/requests')}>
                        <div className="dashboard-card-icon">📂</div>
                        <h3 className="dashboard-card-title">צפה בכל הבקשות</h3>
                        <p className="dashboard-card-desc">עיין, סנן ואשר בקשות מלגה של סטודנטים</p>
                        <span className="dashboard-card-cta">לניהול ←</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
