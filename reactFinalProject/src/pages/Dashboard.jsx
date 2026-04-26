import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import './Dashboard.css'

const STATUS_LABEL = {
    pending:  { text: 'ממתין',  cls: 'badge--pending'  },
    approved: { text: 'אושר',   cls: 'badge--approved' },
    rejected: { text: 'נדחה',   cls: 'badge--rejected' },
}

const Dashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [requests, setRequests] = useState([])

    useEffect(() => {
        API.get('/requests/my-status')
            .then(res => res.data && setRequests([res.data]))
            .catch(() => {})
    }, [])

    return (
        <div className="dashboard-page">
            <div className="dashboard-body">
                <div className="dashboard-welcome">
                    <h2 className="dashboard-welcome-title">ברוך הבא, {user?.firstName}</h2>
                    <p className="dashboard-welcome-sub">מה תרצה לעשות היום?</p>
                </div>

                <div className="dashboard-cards">
                    <button className="dashboard-card" onClick={() => navigate('/sendRequest')}>
                        <div className="dashboard-card-icon">📋</div>
                        <h3 className="dashboard-card-title">הגש בקשה חדשה</h3>
                        <p className="dashboard-card-desc">מלא את טופס הבקשה למלגה בשלבים קצרים</p>
                        <span className="dashboard-card-cta">התחל ←</span>
                    </button>

                    <button className="dashboard-card" onClick={() => navigate('/viewStatus')}>
                        <div className="dashboard-card-icon">🔍</div>
                        <h3 className="dashboard-card-title">צפה בסטטוס הבקשה</h3>
                        <p className="dashboard-card-desc">בדוק את מצב הבקשה שהגשת</p>
                        <span className="dashboard-card-cta">צפה ←</span>
                    </button>
                </div>

                {requests.length > 0 && (
                    <div className="dashboard-table-section">
                        <h3 className="dashboard-table-title">בקשות אחרונות</h3>
                        <div className="dashboard-table-wrapper">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>תאריך הגשה</th>
                                        <th>סטטוס</th>
                                        <th>הודעה</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((r, i) => {
                                        const { text, cls } = STATUS_LABEL[r.status] ?? { text: r.status, cls: 'badge--pending' }
                                        return (
                                            <tr key={i}>
                                                <td>{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('he-IL') : '—'}</td>
                                                <td><span className={`dashboard-badge ${cls}`}>{text}</span></td>
                                                <td>{r.message ?? '—'}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
