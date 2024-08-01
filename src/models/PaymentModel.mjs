// src/models/PaymentModel.mjs
import { Schema, model } from 'mongoose';

const PaymentSchema = new Schema({
    paymentId: { type: Number, default: () => Math.floor(100000 + Math.random() * 900000), unique: true },
    userId: { type: Number, required: true },
    userName: { type: String, required: true },
    transactionNo: { type: String, required: true },
    bankName: { type: String, required: true, trim: true, uppercase: true },
    amount: { type: Number, required: true },
    depositDate: { type: String, required: true},
    paymentMethod: {type: String, required: true},
    status: { type: String, default: 'Pending' }
}, {
    timestamps: true
});
export default model('Payment', PaymentSchema);