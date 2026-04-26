import './forms.css'

const ID_FIELDS = ['fatherIdNumber', 'motherIdNumber']

const FamilyForm = ({ data, onChange }) => {

    const handleChange = (e) => {
        let value = e.target.value
        if (ID_FIELDS.includes(e.target.name)) {
            value = value.replace(/\D/g, '').slice(0, 9)
        }
        onChange({ [e.target.name]: value })
    }

    const handleNumberChange = (e) => {
        const value = Number(e.target.value)
        const field = e.target.name
        onChange({ [field]: value })

        if (field === 'siblingsOver18' || field === 'siblingsUnder21') {
            const total = field === 'siblingsOver18' ? value + data.siblingsUnder21 : data.siblingsOver18 + value
            const current = data.siblings.length
            if (total > current) {
                const toAdd = Array(total - current).fill(null).map(() => ({ idNumber: '', firstName: '', lastName: '', birthDate: '' }))
                onChange({ siblings: [...data.siblings, ...toAdd] })
            } else if (total < current) {
                onChange({ siblings: data.siblings.slice(0, total) })
            }
        }
    }

    const addSibling = () => {
        onChange({ siblings: [...data.siblings, { idNumber: '', firstName: '', lastName: '', birthDate: '' }] })
    }

    const updateSibling = (index, field, value) => {
        onChange({ siblings: data.siblings.map((s, i) => i === index ? { ...s, [field]: value } : s) })
    }

    const removeSibling = (index) => {
        const newSiblings = data.siblings.filter((_, i) => i !== index)
        const newOver18 = data.siblingsOver18 > 0 ? data.siblingsOver18 - 1 : 0
        const newUnder21 = newSiblings.length - newOver18
        onChange({ siblings: newSiblings, siblingsOver18: newOver18, siblingsUnder21: Math.max(0, newUnder21) })
    }

    return (
        <div className="form-container">
            <h3 className="form-title">פרטי משפחה</h3>

            <h4 className="form-section-title">פרטי האב</h4>
            <div className="form-grid">
                <div className="form-field">
                    <label className="form-label">מספר זהות אב *</label>
                    <input className="form-input" type="text" name="fatherIdNumber" value={data.fatherIdNumber} onChange={handleChange} required />
                </div>
                <div className="form-field">
                    <label className="form-label">שם פרטי אב *</label>
                    <input className="form-input" type="text" name="fatherFirstName" value={data.fatherFirstName} onChange={handleChange} required />
                </div>
                <div className="form-field">
                    <label className="form-label">שם משפחה אב *</label>
                    <input className="form-input" type="text" name="fatherLastName" value={data.fatherLastName} onChange={handleChange} required />
                </div>
            </div>

            <h4 className="form-section-title">פרטי האם</h4>
            <div className="form-grid">
                <div className="form-field">
                    <label className="form-label">מספר זהות אם *</label>
                    <input className="form-input" type="text" name="motherIdNumber" value={data.motherIdNumber} onChange={handleChange} required />
                </div>
                <div className="form-field">
                    <label className="form-label">שם פרטי אם *</label>
                    <input className="form-input" type="text" name="motherFirstName" value={data.motherFirstName} onChange={handleChange} required />
                </div>
                <div className="form-field">
                    <label className="form-label">שם משפחה אם *</label>
                    <input className="form-input" type="text" name="motherLastName" value={data.motherLastName} onChange={handleChange} required />
                </div>
            </div>

            <h4 className="form-section-title">אחים</h4>
            <div className="form-grid">
                <div className="form-field">
                    <label className="form-label">מספר אחים מעל גיל 18</label>
                    <input className="form-input" type="number" name="siblingsOver18" value={data.siblingsOver18} onChange={handleNumberChange} min="0" />
                </div>
                <div className="form-field">
                    <label className="form-label">מספר אחים מתחת גיל 21</label>
                    <input className="form-input" type="number" name="siblingsUnder21" value={data.siblingsUnder21} onChange={handleNumberChange} min="0" />
                </div>
            </div>

            {data.siblings.map((sibling, index) => (
                <div key={index} className="sibling-card">
                    <div className="sibling-header">
                        <span className="sibling-title">אח {index + 1}</span>
                        <button className="sibling-remove-btn" onClick={() => removeSibling(index)}>הסר</button>
                    </div>
                    <div className="form-grid">
                        <div className="form-field">
                            <label className="form-label">מספר זהות</label>
                            <input className="form-input" type="text" value={sibling.idNumber} onChange={(e) => updateSibling(index, 'idNumber', e.target.value.replace(/\D/g, '').slice(0, 9))} />
                        </div>
                        <div className="form-field">
                            <label className="form-label">שם פרטי</label>
                            <input className="form-input" type="text" value={sibling.firstName} onChange={(e) => updateSibling(index, 'firstName', e.target.value)} />
                        </div>
                        <div className="form-field">
                            <label className="form-label">שם משפחה</label>
                            <input className="form-input" type="text" value={sibling.lastName} onChange={(e) => updateSibling(index, 'lastName', e.target.value)} />
                        </div>
                        <div className="form-field">
                            <label className="form-label">תאריך לידה</label>
                            <input className="form-input" type="date" value={sibling.birthDate} onChange={(e) => updateSibling(index, 'birthDate', e.target.value)} />
                        </div>
                    </div>
                </div>
            ))}

            <button className="form-add-btn" onClick={addSibling}>+ הוסף אח</button>
        </div>
    )
}

export default FamilyForm
