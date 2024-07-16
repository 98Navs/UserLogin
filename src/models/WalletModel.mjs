// src/models/UserModel.mjs
import { Schema, model } from 'mongoose';

const walletSchema = new Schema({
    userId: { type: Number, unique: true },
    status: { type: String, default: 'Active' },
    amount: { type: Number, default: 0 }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.createdAt = ret.createdAt.toISOString();
            ret.updatedAt = ret.updatedAt.toISOString();
        }
    }
});
export default model('Wallet', walletSchema);