import './forms.css'

const BANKS = ['בנק הפועלים', 'בנק לאומי', 'בנק דיסקונט', 'בנק מזרחי טפחות', 'בנק הבינלאומי', 'בנק יהב', 'בנק אוצר החייל', 'בנק מרכנתיל']

const NUMERIC_FIELDS = ['accountOwnerIdNumber', 'bankNumber', 'branchNumber', 'accountNumber']
const MAX_LENGTH = { accountOwnerIdNumber: 9, bankNumber: 3, branchNumber: 5, accountNumber: 11 }

const BankForm = ({ data, onChange }) => {

    const handleChange = (e) => {
        let value = e.target.value
        if (NUMERIC_FIELDS.includes(e.target.name)) {
            value = value.replace(/\D/g, '').slice(0, MAX_LENGTH[e.target.name] ?? 20)
        }
        onChange({ [e.target.name]: value })
    }

    return (
        <div className="form-container">
            <h3 className="form-title">פרטי חשבון בנק</h3>

            <div className="form-grid">
                <div className="form-field">
                    <label className="form-label">מספר זהות בעל החשבון *</label>
                    <input className="form-input" type="text" name="accountOwnerIdNumber" value={data.accountOwnerIdNumber} onChange={handleChange} required />
                </div>

                <div className="form-field">
                    <label className="form-label">שם בנק *</label>
                    <select className="form-input form-input--select" name="bankName" value={data.bankName} onChange={handleChange} required>
                        <option value="">בחר בנק</option>
                        {BANKS.map(bank => (
                            <option key={bank} value={bank}>{bank}</option>
                        ))}
                    </select>
                </div>

                <div className="form-field">
                    <label className="form-label">מספר בנק *</label>
                    <input className="form-input" type="text" name="bankNumber" value={data.bankNumber} onChange={handleChange} required />
                </div>

                <div className="form-field">
                    <label className="form-label">מספר סניף *</label>
                    <input className="form-input" type="text" name="branchNumber" value={data.branchNumber} onChange={handleChange} required />
                </div>

                <div className="form-field">
                    <label className="form-label">מספר חשבון *</label>
                    <input className="form-input" type="text" name="accountNumber" value={data.accountNumber} onChange={handleChange} required />
                </div>
            </div>
        </div>
    )
}

export default BankForm
