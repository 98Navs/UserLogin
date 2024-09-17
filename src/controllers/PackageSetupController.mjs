// src/controllers/PackageSetupController.mjs
import PackageSetupRepository from "../repositories/PackageSetupRepository.mjs";
import { CommonHandler, ValidationError, NotFoundError } from './CommonHandler.mjs';

class PackageSetupController{
    static async createPackageSetup(req, res) {
        try {
            const packageSetupData = await PackageSetupController.validatePackageSetupData(req.body);
            console.log(packageSetupData);
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

    static async validatePackageSetupData(data) {
        const { packageName, servicesProvided } = data;

        if (!packageName) { throw new ValidationError('Package name is required'); }
        if (!servicesProvided || !Array.isArray(servicesProvided) || servicesProvided.length === 0) { throw new ValidationError('At least one service must be provided'); }

        const existingPackage = await PackageSetupRepository.getPackageSetupByPackageName('BASE PACKAGE');
        if (!existingPackage) { throw new Error('Package not found'); }

        for (const service of servicesProvided) {
            if (!service.serviceType) { throw new ValidationError('Service type is required'); }
            if (service.serviceCharges == null) { throw new ValidationError('Service charges are required'); }
            if (service.serviceLimit == null) { throw new ValidationError('Service limit is required'); }
            if (service.serviceLifeSpan == null) { throw new ValidationError('Service life span is required'); }
        }

        const updatedServicesProvided = servicesProvided.map(service => {
            const matchingService = existingPackage.servicesProvided.find( existingService => existingService.serviceType === service.serviceType );

            if (matchingService) { return { ...service, serviceUrl: matchingService.serviceUrl  };
            } else { return { ...service, serviceUrl: 'URL not found' }; } });

        data.servicesProvided = updatedServicesProvided;

        return data;
    }
}
export default PackageSetupController;