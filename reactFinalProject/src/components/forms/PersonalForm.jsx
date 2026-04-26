import './forms.css'
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'
const PHONE_FIELDS = ['mobilePhone', 'homePhone']

const PersonalForm = ({ data, onChange }) => {

    const handleChange = (e) => {
        let value = e.target.value
        if (PHONE_FIELDS.includes(e.target.name)) {
            value = value.replace(/[^\d-]/g, '')
        }
        onChange({ [e.target.name]: value })
    }

    return (
        <div className="form-container">
            <h3 className="form-title">פרטים אישיים</h3>

            <div className="form-grid">
                <div className="form-field">
                    <label className="form-label">מספר זהות *</label>
                    <input className="form-input" type="text" name="idNumber" value={data.idNumber} readOnly />
                </div>

                <div className="form-field">
                    <label className="form-label">שם פרטי *</label>
                    <input className="form-input" type="text" name="firstName" value={data.firstName} readOnly />
                </div>

                <div className="form-field">
                    <label className="form-label">שם משפחה *</label>
                    <input className="form-input" type="text" name="lastName" value={data.lastName} readOnly />
                </div>

                <div className="form-field">
                    <label className="form-label">תאריך לידה *</label>
                    <input className="form-input" type="date" name="birthDate" value={data.birthDate} onChange={handleChange} required />
                </div>

                {/* <div className="form-field">
                    <label className="form-label">עיר מגורים *</label>
                    <input className="form-input" type="text" name="city" value={data.city} onChange={handleChange} required />
                </div> */}
                <div className="form-field">
                    <label className="form-label">עיר מגורים *</label>
                    <GeoapifyContext apiKey={import.meta.env.VITE_GEOAPIFY_KEY}>
                        <GeoapifyGeocoderAutocomplete
                            placeholder="הזיני עיר"
                            lang="he"
                            countryCodes={['il']}
                            value={data.city}
                            placeSelect={(place) => {
                                onChange({ city: place.properties.city || place.properties.name })
                            }}
                        />
                    </GeoapifyContext>
                </div>
                {/* <div className="form-field">
                    <label className="form-label">כתובת *</label>
                    <input className="form-input" type="text" name="address" value={data.address} onChange={handleChange} required />
                </div> */}
                <div className="form-field">
                    <label className="form-label">כתובת *</label>
                    <GeoapifyContext apiKey={import.meta.env.VITE_GEOAPIFY_KEY}>
                        <GeoapifyGeocoderAutocomplete
                            placeholder="הזיני כתובת"
                            lang="he"
                            countryCodes={['il']}
                            value={data.address}
                            placeSelect={(place) => {
                                onChange({ address: place.properties.formatted })
                            }}
                        />
                    </GeoapifyContext>
                </div>
                <div className="form-field">
                    <label className="form-label">מיקוד</label>
                    <input className="form-input" type="text" name="zipCode" value={data.zipCode} onChange={handleChange} placeholder="הזן מיקוד" maxLength={7} />
                    <a className="form-hint-link" href="https://www.israelpost.co.il/zipcode.nsf/demozip?openform" target="_blank" rel="noreferrer">חיפוש מיקוד באתר הדואר ←</a>
                </div>

                <div className="form-field">
                    <label className="form-label">טלפון נייד *</label>
                    <input className="form-input" type="tel" name="mobilePhone" value={data.mobilePhone} onChange={handleChange} required />
                </div>

                <div className="form-field">
                    <label className="form-label">טלפון נייח (אופציונלי)</label>
                    <input className="form-input" type="tel" name="homePhone" value={data.homePhone} onChange={handleChange} />
                </div>
            </div>
        </div>
    )
}

export default PersonalForm
