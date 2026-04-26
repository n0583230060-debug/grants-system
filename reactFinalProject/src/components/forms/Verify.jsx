import './forms.css'
import './Verify.css'

const DOC_LABELS = {
    studentIdCopy: 'צילום ת.ז. סטודנט',
    studentIdAppendix: 'ספח ת.ז. סטודנט',
    fatherIdCopy: 'צילום ת.ז. אב',
    fatherIdAppendix: 'ספח ת.ז. אב',
    motherIdCopy: 'צילום ת.ז. אם',
    motherIdAppendix: 'ספח ת.ז. אם',
    studyConfirmation: 'אישור לימודים',
    bankConfirmation: 'אישור ניהול חשבון'
}

const display = (v) => (v === null || v === undefined || v === '') ? '—' : String(v)

const joinNames = (a, b) => {
    const parts = [a, b].filter(x => x != null && String(x).trim() !== '')
    return parts.length ? parts.join(' ') : '—'
}

const Verify = ({ formData, onEmailChange }) => {
    const Section = ({ title, children }) => (
        <div className="verify-section">
            <h4 className="verify-section-title">{title}</h4>
            <div className="verify-grid">{children}</div>
        </div>
    )

    const Field = ({ label, value }) => (
        <div className="verify-field">
            <span className="verify-label">{label}:</span>
            <span className="verify-value">{value}</span>
        </div>
    )

    const { personalDetails, familyDetails, studyDetails, bankDetails, documents } = formData

    return (
        <div className="form-container">
            <h3 className="form-title">אישור פרטים ושליחה</h3>
            <p className="verify-subtitle">אנא בדוק שכל הפרטים נכונים לפני השליחה</p>

            <Section title="פרטים אישיים">
                <Field label="מספר זהות" value={display(personalDetails.idNumber)} />
                <Field label="שם פרטי" value={display(personalDetails.firstName)} />
                <Field label="שם משפחה" value={display(personalDetails.lastName)} />
                <Field label="תאריך לידה" value={display(personalDetails.birthDate)} />
                <Field label="עיר" value={display(personalDetails.city)} />
                <Field label="כתובת" value={display(personalDetails.address)} />
                <Field label="טלפון נייד" value={display(personalDetails.mobilePhone)} />
                <Field label="טלפון בית" value={display(personalDetails.homePhone)} />
            </Section>

            <Section title="פרטי משפחה">
                <Field label="מ.ז. אב" value={display(familyDetails.fatherIdNumber)} />
                <Field label="שם אב" value={joinNames(familyDetails.fatherFirstName, familyDetails.fatherLastName)} />
                <Field label="מ.ז. אם" value={display(familyDetails.motherIdNumber)} />
                <Field label="שם אם" value={joinNames(familyDetails.motherFirstName, familyDetails.motherLastName)} />
                <Field label="אחים מעל 18" value={display(familyDetails.siblingsOver18)} />
                <Field label="אחים מתחת 21" value={display(familyDetails.siblingsUnder21)} />
                <Field label="אחים ברשימה" value={familyDetails.siblings?.length ? `${familyDetails.siblings.length} רשומים` : 'אין'} />
            </Section>

            <Section title="פרטי לימודים">
                <Field label="מגמה" value={display(studyDetails.track)} />
                <Field label="מוסד לימודים" value={display(studyDetails.institutionName)} />
                <Field label="שנות לימוד" value={display(studyDetails.studyYears)} />
                <Field label="שכר לימוד שנתי" value={studyDetails.annualTuition !== '' && studyDetails.annualTuition != null ? `₪${studyDetails.annualTuition}` : '—'} />
            </Section>

            <Section title="פרטי בנק">
                <Field label="מ.ז. בעל החשבון" value={display(bankDetails.accountOwnerIdNumber)} />
                <Field label="שם בנק" value={display(bankDetails.bankName)} />
                <Field label="מספר בנק" value={display(bankDetails.bankNumber)} />
                <Field label="מספר סניף" value={display(bankDetails.branchNumber)} />
                <Field label="מספר חשבון" value={display(bankDetails.accountNumber)} />
            </Section>

            <Section title="מסמכים">
                {Object.keys(DOC_LABELS).map((key) => (
                    <Field key={key} label={DOC_LABELS[key]} value={documents[key] instanceof File ? documents[key].name : 'לא הועלה'} />
                ))}
            </Section>

            <div className="verify-email-section">
                <h4 className="form-section-title">דוא״ל לעדכונים</h4>
                <p className="verify-email-desc">כתובת לקבלת עדכון על סטטוס הבקשה (אופציונלי)</p>
                <input
                    className="verify-email-input"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => onEmailChange(e.target.value)}
                />
            </div>

            <div className="verify-confirm-box">
                <p className="verify-confirm-text">אני מאשר/ת שכל הפרטים שמסרתי נכונים ומדויקים</p>
            </div>
        </div>
    )
}

export default Verify
