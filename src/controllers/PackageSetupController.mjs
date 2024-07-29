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

    static async validatePackageSetupData(data) {
        const { packageName, servicesProvided } = data;

        if (!packageName) { throw new ValidationError('Package name is required'); }
        if (!servicesProvided || !Array.isArray(servicesProvided) || servicesProvided.length === 0) { throw new ValidationError('At least one service must be provided'); }

        for (const service of servicesProvided) {
            if (!service.serviceType) { throw new ValidationError('Service type is required'); }
            if (service.serviceCharges == null) { throw new ValidationError('Service charges are required'); }
            if (service.serviceLimit == null) { throw new ValidationError('Service limit is required'); }
        }
        return data;
    }

}
export default PackageSetupController;