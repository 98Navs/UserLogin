// src/models/TransactionHistoryModel.mjs
import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const generateTransactionId = () => { return uuidv4().replace(/-/g, '').slice(0, 10); };

const transactionHistorySchema = new Schema({
    userId: { type: Number, required: true },
    userName: { type: String, required: true },
    transactionId: { type: String, default: generateTransactionId, unique: true },
    serviceName: { type: String, required: true, trim: true, uppercase: true },
    apiOperatorName: { type: String, required: true, trim: true, uppercase: true },
    category: { type: String, required: true, trim: true, uppercase: true },
    amount: { type: Number, required: true },
    gstCharge: { type: Number, required: true },
    type: { type: String, required: true },
    reason: { type: String, default: 'NaN' },
    endResult: { type: String, default: 'NaN' },
    gstNumber: { type: String, default: 'NaN'},
    status: { type: String, default: 'Pending' }
}, {
    timestamps: true
});
export default model('TransactionHistory', transactionHistorySchema);