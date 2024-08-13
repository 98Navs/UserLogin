// src/models/BankDetailsModel.mjs
import { Schema, model } from 'mongoose';

const BankDetailsSchema = new Schema({
    userId: { type: Number, required: true },
    bankId: { type: Number, default: () => Math.floor(100000 + Math.random() * 900000), unique: true },
    bankName: { type: String, required: true, trim: true, uppercase: true },
    accountNumber: { type: Number, required: true },
    accountHolderName: { type: String, required: true, trim: true, uppercase: true},
    ifscCode: { type: String, required: true, trim: true, uppercase: true },
    upiId: { type: String, required: false, trim: true },
    saveAs: { type: String, required: true, trim: true, uppercase: true },
    primary: { type: String, default: 'Yes' },
    status: { type: String, default: 'Active' }
}, {
    timestamps: true
});
export default model('BankDetails', BankDetailsSchema);