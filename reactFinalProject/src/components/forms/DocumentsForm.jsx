import './forms.css'
import './DocumentsForm.css'

const DocumentsForm = ({ data, onChange }) => {
    const handleFileChange = (name) => (e) => {
        const f = e.target.files?.[0]
        if (f) onChange({ [name]: f })
        e.target.value = ''
    }

    const clearFile = (name) => () => onChange({ [name]: null })

    const FileField = ({ name, label, required = true }) => {
        const file = data[name]
        const hasFile = file instanceof File

        return (
            <div className="doc-field">
                <div className="doc-label-row">
                    <span className="doc-label">
                        {label} {required && <span className="doc-label-required">*</span>}
                    </span>
                </div>
                <div className="doc-controls">
                    <span className={hasFile ? 'doc-file-name' : 'doc-no-file'}>
                        {hasFile ? file.name : 'לא נבחר קובץ'}
                    </span>
                    <label className="doc-choose-btn">
                        {hasFile ? 'החלף קובץ' : 'בחר קובץ'}
                        <input
                            key={hasFile ? `${name}-1` : `${name}-0`}
                            className="doc-hidden-input"
                            type="file"
                            name={name}
                            accept="image/*,.pdf"
                            onChange={handleFileChange(name)}
                        />
                    </label>
                    {hasFile && (
                        <button type="button" className="doc-remove-btn" onClick={clearFile(name)}>הסר</button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="form-container">
            <h3 className="form-title">העלאת מסמכים</h3>
            <p className="doc-subtitle">ניתן להעלות קבצי תמונה או PDF</p>

            <h4 className="form-section-title">מסמכי סטודנט</h4>
            <FileField name="studentIdCopy" label="צילום תעודת זהות סטודנט" />
            <FileField name="studentIdAppendix" label="ספח תעודת זהות סטודנט" required={false} />
            <FileField name="studyConfirmation" label="אישור לימודים" />

            <h4 className="form-section-title">מסמכי הורים</h4>
            <FileField name="fatherIdCopy" label="צילום תעודת זהות אב" />
            <FileField name="fatherIdAppendix" label="ספח תעודת זהות אב" required={false} />
            <FileField name="motherIdCopy" label="צילום תעודת זהות אם" />
            <FileField name="motherIdAppendix" label="ספח תעודת זהות אם" required={false} />

            <h4 className="form-section-title">מסמכי בנק</h4>
            <FileField name="bankConfirmation" label="אישור ניהול חשבון" />
        </div>
    )
}

export default DocumentsForm
