// src/controllers/ServiceTableController.mjs
import ServiceTableRepository from "../repositories/ServiceTableRepository.mjs";
import appClass from '../app.mjs';
import { CommonHandler, ValidationError } from "./CommonHandler.mjs";

class ServiceTableController{
    static async createServiceTable(req, res) {
        try {
            const serviceTableData = await ServiceTableController.validateServiceTable(req.body); 
            const serviceTable = await ServiceTableRepository.createServiceTable(serviceTableData);
            res.status(201).json({ status: 201, success: true, message: `Service table created successfully`, data: serviceTable });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getCpuNumber(req, res) {
        try {
            const cpuNumber = await parseInt(appClass);
            console.log(cpuNumber);
            res.status(200).json({ status: 200, success: true, message: `Total number of CPUs availaible`, data: cpuNumber });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async validateServiceTable(data) {
        const { serviceName, serviceId, category } = data;

        await CommonHandler.validateRequiredFields({ serviceName, serviceId, category });
        if (typeof serviceName !== 'string') { throw new ValidationError('Service name must be a string') };
        if (typeof serviceId !== 'number') { throw new ValidationError('Service id must be a number') };
        if (typeof category !== 'string') { throw new ValidationError('Category name must be a string') };

        const service = await ServiceTableRepository.getServiceTableByServiceId(serviceId);
        if(service){throw new ValidationError(`ServiceId already exist for service:${service.serviceName} `)}

        return data;
    }
}
export default ServiceTableController;