// src/models/UserModel.mjs
import { Schema, model } from 'mongoose';

const walletSchema = new Schema({
    userId: { type: Number, unique: true },
    status: { type: String, default: 'Active' },
    amount: { type: Number, default: 0 }
}, {
    timestamps: true
});
export default model('Wallet', walletSchema);