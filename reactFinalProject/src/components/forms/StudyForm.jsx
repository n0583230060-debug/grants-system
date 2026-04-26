import { useState, useRef, useEffect } from 'react'
import './forms.css'

const TRACKS = ['מדעי המחשב', 'הנדסת תוכנה', 'הנדסת חשמל', 'מנהל עסקים', 'משפטים', 'רפואה', 'סיעוד', 'חינוך', 'אחר']

const CustomSelect = ({ value, onChange, placeholder }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const select = (track) => { onChange(track); setOpen(false) }

    return (
        <div className="custom-select" ref={ref}>
            <button type="button" className={`custom-select-trigger form-input ${open ? 'is-open' : ''}`} onClick={() => setOpen(o => !o)}>
                <span className={value ? '' : 'custom-select-placeholder'}>{value || placeholder}</span>
                <svg className={`custom-select-arrow ${open ? 'is-open' : ''}`} width="12" height="12" viewBox="0 0 12 12">
                    <path fill="currentColor" d="M6 8L1 3h10z" />
                </svg>
            </button>
            {open && (
                <ul className="custom-select-list">
                    {TRACKS.map(track => (
                        <li
                            key={track}
                            className={`custom-select-option ${track === value ? 'is-selected' : ''}`}
                            onClick={() => select(track)}
                        >
                            {track}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

const StudyForm = ({ data, onChange }) => {

    const handleChange = (e) => {
        const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
        onChange({ [e.target.name]: value })
    }

    return (
        <div className="form-container">
            <h3 className="form-title">פרטי לימודים</h3>

            <div className="form-grid">
                <div className="form-field">
                    <label className="form-label">מגמה *</label>
                    <CustomSelect
                        value={data.track}
                        onChange={(val) => onChange({ track: val })}
                        placeholder="בחר מגמה"
                    />
                </div>

                <div className="form-field">
                    <label className="form-label">שם מוסד לימודים *</label>
                    <input className="form-input" type="text" name="institutionName" value={data.institutionName} onChange={handleChange} required />
                </div>

                <div className="form-field">
                    <label className="form-label">שנות לימוד *</label>
                    <input className="form-input" type="number" name="studyYears" value={data.studyYears} onChange={handleChange} min="1" max="8" required />
                </div>

                <div className="form-field">
                    <label className="form-label">שכר לימוד שנתי (₪) *</label>
                    <input className="form-input" type="number" name="annualTuition" value={data.annualTuition} onChange={handleChange} min="0" required />
                </div>
            </div>
        </div>
    )
}

export default StudyForm
