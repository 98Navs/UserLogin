// src/repositories/PackageSetupRepository.mjs
import PackageSetup from "../models/PackageSetupModel.mjs";
import { paginate } from '../project_setup/Utils.mjs';

class PackageSetupRepository{
    static async createPackageSetup(packageSetupData) { return await PackageSetup.create(packageSetupData); }

    static async getAllPackageSetup(options, req) { return await paginate(PackageSetup, {}, options.page, options.limit, req); }

    static async getAllAvailablePackageSetupNames() { return await PackageSetup.find(); }

    static async getPackageByPackageId(packageId) { return await PackageSetup.findOne({ packageId }); }

    static async getPackageSetupByPackageName(packageName) { return await PackageSetup.findOne({ packageName: new RegExp(`^${packageName}`, 'i') }); }

    static async updatePackageSetupByPackageId(packageId, packageSetupData) { return await PackageSetup.findOneAndUpdate({ packageId }, packageSetupData, { new: true }); }

    static async deletePackageSetupByPackageId(packageId) { return await PackageSetup.findOneAndDelete({ packageId }); }

    static async filterPackageSetup(filterParams, options, req) {
        const query = {};
        if (filterParams.search) {
            const searchRegex = new RegExp(`^${filterParams.search}`, 'i');
            query.$or = [ { packageName: searchRegex } ];
        }
        if (filterParams.startDate || filterParams.endDate) {
            query.createdAt = {};
            if (filterParams.startDate) query.createdAt.$gte = new Date(filterParams.startDate);
            if (filterParams.endDate) { query.createdAt.$lte = new Date(new Date(filterParams.endDate).setHours(23, 59, 59, 999)); }
        }
        return await paginate(PackageSetup, query, options.page, options.limit, req);
    }
}
export default PackageSetupRepository;