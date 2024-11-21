// src/controllers/PackageSetupController.mjs
import PackageSetupRepository from "../repositories/PackageSetupRepository.mjs";
import { CommonHandler, ValidationError, NotFoundError } from './CommonHandler.mjs';

class PackageSetupController{
    static async createPackageSetup(req, res) {
        try {
            const packageSetupData = await PackageSetupController.validatePackageSetupData(req.body);
            const packageSetup = await PackageSetupRepository.createPackageSetup(packageSetupData);
            res.status(201).json({ status: 201, success: true, message: 'Package setup created successfully', data: packageSetup });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getAllPackageSetup(req, res) {
        try {
            const { status, search, startDate, endDate, pageNumber = 1, perpage = 10 } = req.query;
            const options = { page: Number(pageNumber), limit: Number(perpage) };
            const filterParams = { status, search, startDate, endDate };
            const packageSetup = Object.keys(filterParams).length > 0 ?
                await PackageSetupRepository.filterPackageSetup(filterParams, options, req) :
                await PackageSetupRepository.getAllPackageSetup(options, req);
            res.status(200).json({ status: 200, success: true, message: 'All package setup fetched successfully', data: packageSetup });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getPackageByPackageId(req, res) {
        try {
            const { packageId } = req.params;
            const packageSetup = await PackageSetupController.validateAndFetchPackageSetupByPackageId(packageId);
            res.status(200).json({ status: 200, success: true, message: 'Package fetched successfully', data: packageSetup });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async updatePackageSetupByPackageId(req, res) {
        try {
            const { packageId } = req.params;
            await PackageSetupController.validateAndFetchPackageSetupByPackageId(packageId);
            const updatedData = await PackageSetupController.validatePackageSetupData(req.body);
            const updatedPackageSetup = await PackageSetupRepository.updatePackageSetupByPackageId(packageId, updatedData);
            res.status(200).json({ status: 200, success: true, message: 'Package setup updated successfully', data: updatedPackageSetup });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async deletePackageSetupByPackageId(req, res) {
        try {
            const { packageId } = req.params;
            if (packageId == 673829) { throw new ValidationError('Admin package can not be deleted.'); }
            await PackageSetupController.validateAndFetchPackageSetupByPackageId(packageId);
            const deletedPackageSetup = await PackageSetupRepository.deletePackageSetupByPackageId(packageId);
            res.status(200).json({ status: 200, success: true, message: 'Package setup deleted successfully', data: deletedPackageSetup });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    // Static Methods Only For This Class (Not To Be Used In Routes)
    static async validateAndFetchPackageSetupByPackageName(packageName) {
        const packageSetup = await PackageSetupRepository.getPackageSetupByPackageName(packageName);
        if (!packageSetup) { throw new NotFoundError(`Package setup with packageName: ${packageName} not found`); }
        return packageSetup;
    }

    static async validateAndFetchPackageSetupByPackageId(packageId) {
        const packageSetup = await PackageSetupRepository.getPackageByPackageId(packageId);
        if (!packageSetup) { throw new NotFoundError(`Package setup with packageId: ${packageId} not found`); }
        return packageSetup;
    }

    static async validatePackageSetupData(data) {
        const { packageName, packageLifeSpan, packageCharges, servicesProvided } = data;

        await CommonHandler.validateRequiredFields({packageName, packageLifeSpan, packageCharges})
        if (!servicesProvided || !Array.isArray(servicesProvided) || servicesProvided.length === 0) { throw new ValidationError('At least one service must be provided'); }

        const existingPackage = await PackageSetupRepository.getPackageSetupByPackageName('ADMIN PACKAGE');
        if (!existingPackage) { throw new NotFoundError('Package not found'); }

        for (const service of servicesProvided) {
            if (!service.serviceType) { throw new ValidationError('Service type is required'); }
            if (service.serviceCharge == null) { throw new ValidationError('Service charge are required'); }
        }

        const updatedServicesProvided = servicesProvided.map(service => {
            const matchingService = existingPackage.servicesProvided.find( existingService => existingService.serviceType === service.serviceType );
            if (matchingService) { return { ...service, serviceUrl: matchingService.serviceUrl  };
            } else { return { ...service, serviceUrl: 'URL not found' }; }
        });
        
        data.servicesProvided = updatedServicesProvided;
        return data;
    }
}
export default PackageSetupController;