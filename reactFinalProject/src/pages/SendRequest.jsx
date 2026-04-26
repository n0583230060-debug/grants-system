import { useState ,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import API from "../api/axios"
import "./SendRequest.css"
import PersonalForm from "../components/forms/PersonalForm"
import FamilyForm from "../components/forms/FamilyForm"
import StudyForm from "../components/forms/StudyForm"
import BankForm from "../components/forms/BankForm"
import DocumentsForm from "../components/forms/DocumentsForm"
import Verify from "../components/forms/Verify"

const STEP_REQUIRED = [
    { section: 'personalDetails', fields: { birthDate: 'תאריך לידה', city: 'עיר מגורים', address: 'כתובת', mobilePhone: 'טלפון נייד' } },
    { section: 'familyDetails', fields: { fatherIdNumber: 'מ.ז. אב', fatherFirstName: 'שם פרטי אב', fatherLastName: 'שם משפחה אב', motherIdNumber: 'מ.ז. אם', motherFirstName: 'שם פרטי אם', motherLastName: 'שם משפחה אם' } },
    { section: 'studyDetails', fields: { track: 'מגמה', institutionName: 'מוסד לימודים', studyYears: 'שנות לימוד', annualTuition: 'שכר לימוד שנתי' } },
    { section: 'bankDetails', fields: { accountOwnerIdNumber: 'מ.ז. בעל החשבון', bankName: 'שם בנק', bankNumber: 'מספר בנק', branchNumber: 'מספר סניף', accountNumber: 'מספר חשבון' } },
    { section: 'documents', fields: { studentIdCopy: 'צילום ת.ז. סטודנט', studyConfirmation: 'אישור לימודים', fatherIdCopy: 'צילום ת.ז. אב', motherIdCopy: 'צילום ת.ז. אם', bankConfirmation: 'אישור ניהול חשבון' } },
]

const SendRequest = () => {
    const STEPS = ['פרטים אישיים', 'פרטי משפחה', 'פרטי לימודים', 'פרטי בנק', 'מסמכים', 'אישור ושליחה']

        const { user } = useAuth()
        const navigate = useNavigate()
        const [currentStep, setCurrentStep] = useState(0)
        const [formData, setFormData] = useState(
            // {
            
            //     "personalDetails": {
            //       "idNumber": "123456789",
            //       "firstName": "יוסי",
            //       "lastName": "כהן",
            //       "birthDate": "1999-03-15",
            //       "city": "תל אביב",
            //       "address": "רחוב הרצל 42",
            //       "mobilePhone": "050-1234567",
            //       "homePhone": "03-1234567"
            //     },
            //     "familyDetails": {
            //       "fatherIdNumber": "987654321",
            //       "fatherFirstName": "דוד",
            //       "fatherLastName": "כהן",
            //       "motherIdNumber": "456789123",
            //       "motherFirstName": "רחל",
            //       "motherLastName": "כהן",
            //       "siblingsOver18": 2,
            //       "siblingsUnder21": 1,
            //       "siblings": [
            //         {
            //           "idNumber": "111222333",
            //           "firstName": "שרה",
            //           "lastName": "כהן",
            //           "birthDate": "2001-07-20"
            //         },
            //         {
            //           "idNumber": "444555666",
            //           "firstName": "משה",
            //           "lastName": "כהן",
            //           "birthDate": "2004-11-05"
            //         }
            //       ]
            //     },
            //     "studyDetails": {
            //       "track": "הנדסת תוכנה",
            //       "institutionName": "אוניברסיטת תל אביב",
            //       "studyYears": "4",
            //       "annualTuition": "12000"
            //     },
            //     "bankDetails": {
            //       "accountOwnerIdNumber": "123456789",
            //       "bankName": "בנק הפועלים",
            //       "bankNumber": "12",
            //       "branchNumber": "456",
            //       "accountNumber": "78901234"
            //     },
            //     "documents": {
            //       "studentIdCopy": null,
            //       "studentIdAppendix": null,
            //       "fatherIdCopy": null,
            //       "fatherIdAppendix": null,
            //       "motherIdCopy": null,
            //       "motherIdAppendix": null,
            //       "studyConfirmation": null,
            //       "bankConfirmation": null
            //     },
            //     "email": "yossi.cohen@gmail.com"
            //   }
            {
            personalDetails: {
                idNumber: '',
                firstName: '',
                lastName: '',
                birthDate: '',
                city: '',
                address: '',
                zipCode: '',  
                mobilePhone: '',
                homePhone: ''
            },
            familyDetails: {
                fatherIdNumber: '',
                fatherFirstName: '',
                fatherLastName: '',
                motherIdNumber: '',
                motherFirstName: '',
                motherLastName: '',
                siblingsOver18: 0,
                siblingsUnder21: 0,
                siblings: []
            },
            studyDetails: {
                track: '',
                institutionName: '',
                studyYears: '',
                annualTuition: ''
            },
            bankDetails: {
                accountOwnerIdNumber: '',
                bankName: '',
                bankNumber: '',
                branchNumber: '',
                accountNumber: ''
            },
            documents: {
                studentIdCopy: null,
                studentIdAppendix: null,
                fatherIdCopy: null,
                fatherIdAppendix: null,
                motherIdCopy: null,
                motherIdAppendix: null,
                studyConfirmation: null,
                bankConfirmation: null
            },
            email: ''
        }
        )
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState('')
        const [success, setSuccess] = useState(false)
        const [draftSaved, setDraftSaved] = useState(false)
    
        // טעינת טיוטה קיימת בכניסה לדף
        useEffect(() => {
            const loadDraft = async () => {
                try {
                    const res = await API.get('/requests/draft')
                    if (res.data) {
                        const toDate = (v) => v ? String(v).slice(0, 10) : ''
                        setFormData(prev => ({
                            ...prev,
                            ...res.data,
                            personalDetails: {
                                ...res.data.personalDetails,
                                birthDate: toDate(res.data.personalDetails?.birthDate),
                                ...(user && {
                                    idNumber: user.idNumber,
                                    firstName: user.firstName,
                                    lastName: user.lastName
                                })
                            }
                        }))
                    }
                } catch (err) {
                //    console.log("// אין טיוטה — לא שגיאה")
                }
            }
            loadDraft()
        }, [user])
    
        // מילוי אוטומטי של פרטים אישיים מהמשתמש המחובר
        useEffect(() => {
            if (user) {
                setFormData(prev => ({
                    ...prev,
                    personalDetails: {
                        ...prev.personalDetails,
                        idNumber: user.idNumber,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }
                }))
            }
        }, [user])
    
        // עדכון שדה בתוך section מסוים
        const updateFormData = (section, data) => {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], ...data }
            }))
        }
    
        const toNullable = (obj) =>
            Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === '' ? null : v]))

        // שמירת טיוטה
        const saveDraft = async () => {
            setError('')
            try {
                const payload = {
                    personalDetails: toNullable(formData.personalDetails),
                    familyDetails: toNullable(formData.familyDetails),
                    studyDetails: toNullable(formData.studyDetails),
                    bankDetails: toNullable(formData.bankDetails),
                    email: formData.email || null
                }
                await API.post('/requests/draft', payload)
                setDraftSaved(true)
                setTimeout(() => setDraftSaved(false), 3000)
            } catch (err) {
                setError(err.response?.data?.message || 'שגיאה בשמירת הטיוטה')
            }
        }
    
        const validateStep = () => {
            const step = STEP_REQUIRED[currentStep]
            if (!step) return null
            for (const [field, label] of Object.entries(step.fields)) {
                if (!formData[step.section][field]) return `יש למלא: ${label}`
            }
            return null
        }

        // מעבר לשלב הבא
        const nextStep = () => {
            const err = validateStep()
            if (err) { setError(err); return }
            setCurrentStep(prev => prev + 1)
            setError('')
        }
    
        // חזרה לשלב הקודם
        const prevStep = () => {
            setCurrentStep(prev => prev - 1)
            setError('')
        }
    

const submitRequest = async () => {
    setError('')
    setLoading(true)
   
    const formDataToSend = new FormData()
    formDataToSend.append('personalDetails', JSON.stringify(formData.personalDetails))
    formDataToSend.append('familyDetails', JSON.stringify(formData.familyDetails))
    formDataToSend.append('studyDetails', JSON.stringify(formData.studyDetails))
    formDataToSend.append('bankDetails', JSON.stringify(formData.bankDetails))
    formDataToSend.append('email', formData.email)
    Object.keys(formData.documents).forEach(key => {
        if (formData.documents[key]) {
            formDataToSend.append(key, formData.documents[key])
        }
    })
    try {
        await API.post('/requests/submit', formDataToSend ,
            { headers: { 'Content-Type': 'multipart/form-data' } })
        setSuccess(true)
    }
    catch(err){
        setError(err.response?.data?.message || 'שגיאה בשליחת הבקשה')
    }
    finally{
        setLoading(false)
    }
}


const renderStep = () => {
    switch(currentStep) {
        case 0: return <PersonalForm  data={formData.personalDetails} onChange={(data) => updateFormData('personalDetails', data)}  />
        case 1: return <FamilyForm data={formData.familyDetails} onChange={(data) => updateFormData('familyDetails', data)} />
        case 2: return <StudyForm data={formData.studyDetails} onChange={(data) => updateFormData('studyDetails', data)} />
        case 3: return <BankForm data={formData.bankDetails} onChange={(data) => updateFormData('bankDetails', data)} /> 
        case 4: return <DocumentsForm data={formData.documents} onChange={(data) => updateFormData('documents', data)} />
        case 5: return (
            <Verify
                formData={formData}
                onEmailChange={(email) => setFormData((prev) => ({ ...prev, email }))}
            />
        )
        default: return null
    }
}
if (success) {
    return (
        <div className="send-request-success-container">
            <h2>הבקשה הוגשה בהצלחה!</h2>
            <p>בקשתך התקבלה ונמצאת בבדיקה</p>
            <button className="send-request-next-btn" onClick={() => navigate('/dashboard')}>חזרה לדף הבית</button>
        </div>
    )
}
    return (
        <div className="send-request-container">
        <button className="send-request-back-btn" onClick={() => navigate('/dashboard')}>← חזרה</button>
        {/* פס התקדמות */}
        <div className="send-request-steps-bar">
            {STEPS.map((step, index) => (
                <div key={index} className="send-request-step-item">
                    <div
                        className={`send-request-step-circle ${index <= currentStep ? "is-active" : ""}`}
                    >
                        {index < currentStep ? '✓' : index + 1}
                    </div>
                    <span className={`send-request-step-label ${index <= currentStep ? "is-active" : ""}`}>
                        {step}
                    </span>
                </div>
            ))}
        </div>

        {draftSaved && (
            <div className="send-request-toast">✓ הטיוטה נשמרה בהצלחה</div>
        )}

        {/* תוכן השלב הנוכחי */}
        <div className="send-request-form-container">
            {error && <div className="send-request-error">{error}</div>}
            {renderStep()}
        </div>

        {/* כפתורי ניווט */}
        <div className="send-request-navigation">
            <button
                className="send-request-save-draft-btn"
                onClick={saveDraft}
            >
                שמור טיוטה
            </button>

            <div className="send-request-nav-buttons">
                {currentStep > 0 && (
                    <button className="send-request-prev-btn" onClick={prevStep}>
                        ← הקודם
                    </button>
                )}

                {currentStep < STEPS.length - 1 ? (
                    <button className="send-request-next-btn" onClick={nextStep}>
                        הבא ←
                    </button>
                ) : (
                    <button
                        className={`send-request-submit-btn ${loading ? "is-disabled" : ""}`}
                        onClick={submitRequest}
                        disabled={loading}
                    >
                        {loading ? 'שולח...' : 'הגש בקשה'}
                    </button>
                )}
            </div>
        </div>
    </div>
)
}

export default SendRequest