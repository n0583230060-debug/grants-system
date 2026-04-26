import mongoose from 'mongoose'

const siblingSchema = new mongoose.Schema({
    idNumber: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true }
})

const grantRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    personalDetails: {
        idNumber: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        birthDate: { type: Date, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true },
        zipCode: { type: String }, 
        mobilePhone: { type: String, required: true },
        homePhone: { type: String }
    },

    familyDetails: {
        fatherIdNumber: { type: String, required: true },
        fatherFirstName: { type: String, required: true },
        fatherLastName: { type: String, required: true },
        motherIdNumber: { type: String, required: true },
        motherFirstName: { type: String, required: true },
        motherLastName: { type: String, required: true },
        siblingsOver18: { type: Number, default: 0 },
        siblingsUnder21: { type: Number, default: 0 },
        siblings: [siblingSchema]
    },

    studyDetails: {
        track: { type: String, required: true },
        institutionName: { type: String, required: true },
        studyYears: { type: Number, required: true },
        annualTuition: { type: Number, required: true }
    },

    bankDetails: {
        accountOwnerIdNumber: { type: String, required: true },
        bankName: { type: String, required: true },
        bankNumber: { type: String, required: true },
        branchNumber: { type: String, required: true },
        accountNumber: { type: String, required: true }
    },

    documents: {
        studentIdCopy: { type: String },
        studentIdAppendix: { type: String },
        fatherIdCopy: { type: String },
        fatherIdAppendix: { type: String },
        motherIdCopy: { type: String },
        motherIdAppendix: { type: String },
        studyConfirmation: { type: String },
        bankConfirmation: { type: String }
    },

    email: { type: String },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    isDraft: {
        type: Boolean,
        default: false
    },

    submittedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true })

export default mongoose.model('GrantRequest', grantRequestSchema)