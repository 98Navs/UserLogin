// src/models/ApiPartiesModel.mjs
import { Schema, model } from 'mongoose';

const serviceTableSchema = new Schema({
    serviceName: { type: String, require: true, trim: true, uppercase: true },
    serviceId: { type: Number, require: true },
    category: { type: String, require: true, trim: true, uppercase: true },
    image: { type: String, require: true, default: 'NaN'}
}, {
    timestamps: true
});
export default model('ServiceTable', serviceTableSchema);