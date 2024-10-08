// src/models/UserModel.mjs
import { Schema, model } from 'mongoose';
import crypto from 'crypto';

const generateDefaultApiKey = () => { return crypto.randomBytes(25).toString('hex'); };

const services = new Schema({
    serviceType: { type: String, required: true },
    serviceChecked: { type: Boolean, default: false },
    serviceUrl: { type: String, required: true },
    status: { type: String, required: true }
}, { _id: false });

const addressInputs = new Schema({
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: Number, required: true }
}, { _id: false });

const userSchema = new Schema({
    userId: { type: Number, default: () => Math.floor(100000 + Math.random() * 900000), unique: true },
    userName: { type: String, required: true, trim: true, uppercase: true },
    email: { type: String, required: true, unique: true, trim: true, uppercase: true },
    mobile: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    amount: { type: Number, default: 0 },
    apiKey: { type: String, default: generateDefaultApiKey, unique: true },
    whiteListIp: [{ type: String }],
    packageName: { type: String, default: 'Default Package' },
    packageLifeSpan: { type: String, required: true },
    packageDetails: [services],
    role: { type: String, default: 'user' },
    panNumber: { type: String, default: 'NaN' },
    gstNumber: { type: String, default: 'NaN' },
    companyName: { type: String, default: 'NaN' },
    companyAddress: { type: String, default: 'NaN' },
    companyUrl: { type: String, default: 'NaN' },
    addressDetails: addressInputs ,
    status: { type: String, default: 'Active' },
    otp: { type: Number, default: null }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.password;
            delete ret.otp;
            delete ret.apiKey;
            delete ret.whiteListIp;
            ret.createdAt = ret.createdAt.toISOString();
            ret.updatedAt = ret.updatedAt.toISOString();
        }
    }
});
export default model('User', userSchema);