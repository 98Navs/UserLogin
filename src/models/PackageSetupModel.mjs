// src/models/PackageSetupModel.mjs
import { Schema, model } from 'mongoose';

const services = new Schema({
    serviceType: { type: String, required: true },
    serviceCharge : { type: Number, required: true },
    serviceUrl: { type: String, required: true },
    status: { type: String, default: "Active" }
}, { _id: false });

const packageSetupSchema = new Schema({
    packageId: { type: Number, default: () => Math.floor(100000 + Math.random() * 900000), unique: true },
    packageName: { type: String, required: true, trim: true, uppercase: true },
    servicesProvided: [services],
    packageLifeSpan: { type: Number, required: true },
    packageCharges: { type: Number, required: true },
    status: { type: String, default: 'Active' },
}, {
    timestamps: true
});
export default model('PackageSetup', packageSetupSchema);