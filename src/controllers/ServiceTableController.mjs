import ServiceTableRepository from "../repositories/ServiceTableRepository.mjs";
import { CommonHandler, ValidationError } from "./CommonHandler.mjs";

class ServiceTableController{
    static async createServiceTable(req, res) {
        try {
            const serviceTableData = await ServiceTableController.validateServiceTable(req.body); 
            const serviceTable = await ServiceTableRepository.createServiceTable(serviceTableData);
            res.status(200).json({ status: 200, success: true, message: `Service table created successfully`, data: serviceTable });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async validateServiceTable(data) {
        const { serviceName, serviceId, image } = data;

        await CommonHandler.validateRequiredFields({ serviceName, serviceId, image });
        if (typeof serviceName !== 'string') { throw new ValidationError('Service name must be a string') };
        if (typeof serviceId !== 'number') { throw new ValidationError('Service id must be a number') };
        if (typeof image !== 'string') { throw new ValidationError('Image must be of string type') };

        return data;
    }

}
export default ServiceTableController;