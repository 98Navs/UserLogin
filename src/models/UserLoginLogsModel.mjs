// src/models/UserApiKeyModel.mjs
import { Schema, model } from 'mongoose';

const userLoginLogsSchema = new Schema({
    userId: { type: Number, required: true },
    ipAddress: { type: String, required: false, default: 'NaN' },
    deviceName: { type: String, required: false, default: 'NaN' },
    location: { type: String, required: false, default: 'NaN' },
    token: { type: String, require: true },
    status: { type: String, require: true, default: 'ACTIVE' }
}, {
    timestamps: true
});
export default model('UserLoginLogs', userLoginLogsSchema);