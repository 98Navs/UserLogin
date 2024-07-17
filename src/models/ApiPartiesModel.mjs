// src/models/UserModel.mjs
import { Schema, model } from 'mongoose';

const apiPartiesSchema = new Schema({
    apiOperatorName: { type: String, require: true, trim: true, uppercase: true },
    operationName: { type: String, require: true, trim: true, uppercase: true },
    category: { type: String, require: true, trim: true, uppercase: true },
    apiOperatorCharges: { type: Number, require: true },
    ourCharges: { type: Number, require: true },   
    primary: { type: String, default: 'No' },
    status: { type: String, default: 'Active' },
}, {
    timestamps: true
});
export default model('ApiParties', apiPartiesSchema);