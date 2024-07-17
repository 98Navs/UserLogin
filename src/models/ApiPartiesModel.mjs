// src/models/ApiPartiesModel.mjs
import { Schema, model } from 'mongoose';

const apiPartiesSchema = new Schema({
    apiOperatorId: { type: Number, default: () => Math.floor(100000 + Math.random() * 900000), unique: true },
    apiOperatorName: { type: String, require: true, trim: true, uppercase: true },
    serviceName: { type: String, require: true, trim: true, uppercase: true },
    serviceId: { type: Number, require: true },
    category: { type: String, require: true, trim: true, uppercase: true },
    apiOperatorCharges: { type: Number, require: true },
    ourCharges: { type: Number, require: true, default: 0 },   
    primary: { type: String, default: 'No' },
    status: { type: String, default: 'Active' },
}, {
    timestamps: true
});
export default model('ApiParties', apiPartiesSchema);