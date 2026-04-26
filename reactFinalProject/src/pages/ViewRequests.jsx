import { useState, useEffect } from "react"
import API from "../api/axios"
import { useNavigate } from "react-router-dom"
import './ViewRequests.css'

const STATUS_MAP = {
    pending:  { label: 'ממתין',  cls: 'vr-badge--pending'  },
    approved: { label: 'אושר',   cls: 'vr-badge--approved' },
    rejected: { label: 'נדחה',   cls: 'vr-badge--rejected' },
}

const ViewRequests = () => {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [filters, setFilters] = useState({
        idNumber: '', fromDate: '', toDate: '',
        city: '', minTuition: '', maxTuition: '',
        siblingsOver18: '', siblingsUnder21: ''
    })
    const navigate = useNavigate()

    const loadRequests = () => {
        setLoading(true)
        API.get('/requests/all', { params: filters })
            .then(res => setRequests(res.data || []))
            .catch(() => setError('שגיאה בטעינת הבקשות'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { loadRequests() }, [])

    const handleFilterChange = (e) =>
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const resetFilters = () => {
        setFilters({ idNumber: '', fromDate: '', toDate: '', city: '', minTuition: '', maxTuition: '', siblingsOver18: '', siblingsUnder21: '' })
    }

    return (
        <div className="vr-page">
            <div className="vr-header">
                <button className="vr-btn-back" onClick={() => navigate('/admin')}>→ חזרה</button>
                <h2 className="vr-title">ניהול בקשות</h2>
            </div>

            {error && <div className="vr-error">{error}</div>}

            <div className="vr-filters">
                <div className="vr-filter-field">
                    <label className="vr-filter-label">מספר זהות</label>
                    <input className="vr-filter-input" name="idNumber" value={filters.idNumber} onChange={handleFilterChange} placeholder="חיפוש לפי מ.ז" />
                </div>
                <div className="vr-filter-field">
                    <label className="vr-filter-label">עיר</label>
                    <input className="vr-filter-input" name="city" value={filters.city} onChange={handleFilterChange} placeholder="עיר" />
                </div>
                <div className="vr-filter-field">
                    <label className="vr-filter-label">מתאריך</label>
                    <input className="vr-filter-input" name="fromDate" type="date" value={filters.fromDate} onChange={handleFilterChange} />
                </div>
                <div className="vr-filter-field">
                    <label className="vr-filter-label">עד תאריך</label>
                    <input className="vr-filter-input" name="toDate" type="date" value={filters.toDate} onChange={handleFilterChange} />
                </div>
                <div className="vr-filter-field">
                    <label className="vr-filter-label">שכ"ל מינימום</label>
                    <input className="vr-filter-input" name="minTuition" type="number" value={filters.minTuition} onChange={handleFilterChange} placeholder="₪" />
                </div>
                <div className="vr-filter-field">
                    <label className="vr-filter-label">שכ"ל מקסימום</label>
                    <input className="vr-filter-input" name="maxTuition" type="number" value={filters.maxTuition} onChange={handleFilterChange} placeholder="₪" />
                </div>
                <div className="vr-filter-actions">
                    <button className="vr-btn-search" onClick={loadRequests}>חפש</button>
                    <button className="vr-btn-reset" onClick={resetFilters}>אפס</button>
                </div>
            </div>

            <div className="vr-table-wrapper">
                <table className="vr-table">
                    <thead>
                        <tr>
                            <th>מ.ז</th>
                            <th>שם פרטי</th>
                            <th>שם משפחה</th>
                            <th>מגמה</th>
                            <th>סטטוס</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr><td colSpan="5" className="vr-empty">טוען...</td></tr>
                        )}
                        {!loading && requests.length === 0 && (
                            <tr><td colSpan="5" className="vr-empty">לא נמצאו בקשות</td></tr>
                        )}
                        {requests.map(req => {
                            const { label, cls } = STATUS_MAP[req.status] ?? { label: req.status, cls: 'vr-badge--pending' }
                            return (
                                <tr key={req._id} onClick={() => navigate(`/admin/requests/${req._id}`)}>
                                    <td>{req.personalDetails?.idNumber}</td>
                                    <td>{req.personalDetails?.firstName}</td>
                                    <td>{req.personalDetails?.lastName}</td>
                                    <td>{req.studyDetails?.track}</td>
                                    <td><span className={`vr-badge ${cls}`}>{label}</span></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewRequests
