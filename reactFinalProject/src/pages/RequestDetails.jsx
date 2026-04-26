import { useState, useEffect } from "react"
import API from "../api/axios"
import { useNavigate, useParams } from "react-router-dom"
import './RequestDetails.css'

const STATUS_MAP = {
    pending:  { label: 'ממתין',  cls: 'rd-badge--pending'  },
    approved: { label: 'אושר',   cls: 'rd-badge--approved' },
    rejected: { label: 'נדחה',   cls: 'rd-badge--rejected' },
}

const RequestDetails = () => {
    const [request, setRequest] = useState(null)
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        API.get(`/requests/${id}`)
            .then(res => res.data && setRequest(res.data))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [id])

    const updateStatus = async (status) => {
        try {
            await API.patch(`/requests/${id}/status`, { status })
            setRequest(prev => ({ ...prev, status }))
            navigate('/admin/requests')
        } catch {
            alert('שגיאה בעדכון הסטטוס')
        }
    }

    const Field = ({ label, value }) => (
        <div className="rd-field">
            <span className="rd-label">{label}</span>
            <span className="rd-value">{value || '—'}</span>
        </div>
    )

    const { label: statusLabel, cls: statusCls } = STATUS_MAP[request?.status] ?? { label: request?.status, cls: 'rd-badge--pending' }

    return (
        <div className="rd-page">
            <button className="rd-back-btn" onClick={() => navigate('/admin/requests')}>← חזרה לרשימה</button>
            <h2 className="rd-title">פרטי בקשה</h2>

            {loading && <p className="rd-loading">טוען...</p>}
            {!loading && !request && <p className="rd-empty">לא נמצאו פרטי בקשה</p>}

            {request && (
                <>
                    <div className="rd-card">
                        <p className="rd-section-title">פרטים אישיים</p>
                        <div className="rd-grid">
                            <Field label="מספר זהות"  value={request.personalDetails?.idNumber} />
                            <Field label="שם פרטי"    value={request.personalDetails?.firstName} />
                            <Field label="שם משפחה"   value={request.personalDetails?.lastName} />
                            <Field label="תאריך לידה" value={request.personalDetails?.birthDate?.slice(0,10)} />
                            <Field label="עיר"         value={request.personalDetails?.city} />
                            <Field label="כתובת"       value={request.personalDetails?.address} />
                            <Field label="טלפון נייד"  value={request.personalDetails?.mobilePhone} />
                        </div>
                    </div>

                    <div className="rd-card">
                        <p className="rd-section-title">פרטי לימודים</p>
                        <div className="rd-grid">
                            <Field label="מגמה"          value={request.studyDetails?.track} />
                            <Field label="מוסד לימודים"  value={request.studyDetails?.institutionName} />
                            <Field label="שנות לימוד"    value={request.studyDetails?.studyYears} />
                            <Field label="שכר לימוד שנתי" value={request.studyDetails?.annualTuition ? `₪${request.studyDetails.annualTuition}` : ''} />
                        </div>
                    </div>
<div className="rd-card">
    <p className="rd-section-title">📎 מסמכים</p>
    <div className="rd-docs-grid">

        {/* סטודנט */}
        <div className="rd-doc-item">
            <span className="rd-label">צילום ת.ז סטודנט</span>
            {request.documents?.studentIdCopy
                ? <a href={`${import.meta.env.VITE_UPLOADS_URL}/${request.documents.studentIdCopy}`} target="_blank" rel="noreferrer">
                    <button className="rd-doc-btn">צפה בקובץ 👁</button>
                  </a>
                : <span className="rd-value">לא הועלה</span>
            }
        </div>

        <div className="rd-doc-item">
            <span className="rd-label">ספח ת.ז סטודנט</span>
            {request.documents?.studentIdAppendix
                ? <a href={`${import.meta.env.VITE_UPLOADS_URL}/${request.documents.studentIdAppendix}`} target="_blank" rel="noreferrer">
                    <button className="rd-doc-btn">צפה בקובץ 👁</button>
                  </a>
                : <span className="rd-value">לא הועלה</span>
            }
        </div>

        <div className="rd-doc-item">
            <span className="rd-label">אישור לימודים</span>
            {request.documents?.studyConfirmation
                ? <a href={`${import.meta.env.VITE_UPLOADS_URL}/${request.documents.studyConfirmation}`} target="_blank" rel="noreferrer">
                    <button className="rd-doc-btn">צפה בקובץ 👁</button>
                  </a>
                : <span className="rd-value">לא הועלה</span>
            }
        </div>

        {/* הורים */}
        <div className="rd-doc-item">
            <span className="rd-label">צילום ת.ז אב</span>
            {request.documents?.fatherIdCopy
                ? <a href={`${import.meta.env.VITE_UPLOADS_URL}/${request.documents.fatherIdCopy}`} target="_blank" rel="noreferrer">
                    <button className="rd-doc-btn">צפה בקובץ 👁</button>
                  </a>
                : <span className="rd-value">לא הועלה</span>
            }
        </div>

        <div className="rd-doc-item">
            <span className="rd-label">ספח ת.ז אב</span>
            {request.documents?.fatherIdAppendix
                ? <a href={`${import.meta.env.VITE_UPLOADS_URL}/${request.documents.fatherIdAppendix}`} target="_blank" rel="noreferrer">
                    <button className="rd-doc-btn">צפה בקובץ 👁</button>
                  </a>
                : <span className="rd-value">לא הועלה</span>
            }
        </div>

        <div className="rd-doc-item">
            <span className="rd-label">צילום ת.ז אם</span>
            {request.documents?.motherIdCopy
                ? <a href={`${import.meta.env.VITE_UPLOADS_URL}/${request.documents.motherIdCopy}`} target="_blank" rel="noreferrer">
                    <button className="rd-doc-btn">צפה בקובץ 👁</button>
                  </a>
                : <span className="rd-value">לא הועלה</span>
            }
        </div>

        <div className="rd-doc-item">
            <span className="rd-label">ספח ת.ז אם</span>
            {request.documents?.motherIdAppendix
                ? <a href={`${import.meta.env.VITE_UPLOADS_URL}/${request.documents.motherIdAppendix}`} target="_blank" rel="noreferrer">
                    <button className="rd-doc-btn">צפה בקובץ 👁</button>
                  </a>
                : <span className="rd-value">לא הועלה</span>
            }
        </div>

        {/* בנק */}
        <div className="rd-doc-item">
            <span className="rd-label">אישור ניהול חשבון</span>
            {request.documents?.bankConfirmation
                ? <a href={`${import.meta.env.VITE_UPLOADS_URL}/${request.documents.bankConfirmation}`} target="_blank" rel="noreferrer">
                    <button className="rd-doc-btn">צפה בקובץ 👁</button>
                  </a>
                : <span className="rd-value">לא הועלה</span>
            }
        </div>

    </div>
</div>
                    <div className="rd-card">
                        <p className="rd-section-title">סטטוס</p>
                        <span className={`rd-badge ${statusCls}`}>{statusLabel}</span>
                    </div>

                    <div className="rd-actions">
                        <button className="rd-btn-approve" onClick={() => updateStatus('approved')}>אשר בקשה ✓</button>
                        <button className="rd-btn-reject"  onClick={() => updateStatus('rejected')}>דחה בקשה ✕</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default RequestDetails
