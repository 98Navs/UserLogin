// src/models/UserModel.mjs
import { Schema, model } from 'mongoose';
import crypto from 'crypto';

const generateDefaultApiKey = () => { return crypto.randomBytes(25).toString('hex'); };

const services = new Schema({
    serviceType: { type: String, required: true },
    serviceLimit: { type: Number, required: true },
    serviceLifeEnds: { type: String, required: true },
    status: { type: String, required: true }
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
    packageName: { type: String, default: 'NaN' },
    packageDetails: [services],
    role: { type: String, default: 'user' },
    panNumber: { type: String, default: 'NaN' },
    gstNumber: { type: String, default: 'NaN' },
    address: { type: String, default: 'NaN' },
    status: { type: String, default: 'Active' },
    otp: { type: Number, default: null }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.password;
            delete ret.otp;
            ret.createdAt = ret.createdAt.toISOString();
            ret.updatedAt = ret.updatedAt.toISOString();
        }
    }
});
export default model('User', userSchema);