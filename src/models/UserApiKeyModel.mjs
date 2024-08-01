// src/models/UserApiKeyModel.mjs
import { Schema, model } from 'mongoose';
import crypto from 'crypto';

const generateDefaultApiKey = () => { return crypto.randomBytes(25).toString('hex'); };

const userApiKeySchema = new Schema({
    userId: { type: Number, required: true },
    apiKey: { type: String, default: generateDefaultApiKey, unique: true },
    whiteListIp: [{ type: String }]
}, {
    timestamps: true
});
export default model('UserApiKey', userApiKeySchema);