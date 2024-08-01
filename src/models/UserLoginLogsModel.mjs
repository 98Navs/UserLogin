// src/models/UserApiKeyModel.mjs
import { Schema, model } from 'mongoose';

const userLoginLogsSchema = new Schema({
    userId: { type: Number, required: true },
    ipAddress: { type: String, required: true, default: 'NaN' },
    deviceName: { type: String, required: true, default: 'NaN' },
    location: { type: String, required: true, default: 'NaN' }
}, {
    timestamps: true
});
export default model('UserLoginLogs', userLoginLogsSchema);