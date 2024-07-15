// src/models/UserModel.mjs
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    userId: { type: Number, default: () => Math.floor(100000 + Math.random() * 900000), unique: true },
    userName: { type: String, required: true, trim: true, uppercase: true },
    email: { type: String, required: true, unique: true, trim: true, uppercase: true },
    mobile: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    status: { type: String, default: 'Active' },
    otp: { type: Number, default: null }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.password;
            delete ret.otp;
            ret.createdAt = ret.createdAt.toISOString();
            ret.updatedAt = ret.updatedAt.toISOString();
        }
    }
});
export default model('User', userSchema);