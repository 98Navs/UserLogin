// src/repositories/PackageSetupRepository.mjs
import PackageSetup from "../models/PackageSetupModel.mjs";


class PackageSetupRepository{

    static async createPackageSetup(packageSetupData) { return await PackageSetup.create(packageSetupData); }

    static async getPackageSetupByPackageName(packageName) { return await PackageSetup.findOne({ packageName }); }

}
export default PackageSetupRepository;