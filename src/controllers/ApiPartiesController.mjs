import ApiPartiesRepository from "../repositories/ApiPartiesRepository.mjs";
import ServiceTableRepository from "../repositories/ServiceTableRepository.mjs";
import { CommonHandler, ValidationError, NotFoundError } from './CommonHandler.mjs';

class ApiPartiesController {
    static async createApiParty(req, res) {
        try {
            const apiPartiesData = await ApiPartiesController.validateApiPartiesData(req.body);
            const apiParty = await ApiPartiesRepository.createApiParty(apiPartiesData);
            res.status(201).json({ status: 201, success: true, message: 'Api party created successfully', data: apiParty });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async changePrimaryByApiOperatorId(req, res) {
        try {
            const { apiOperatorId } = req.params;
            const apiParty = await ApiPartiesController.validateAndFetchApiOperatorByApiId(apiOperatorId);
            const currentPrimary = await ApiPartiesRepository.getCurrentPrimaryByServiceName(apiParty.serviceName);
            if (currentPrimary) { await ApiPartiesRepository.updateApiPartyDetailsByApiOperatorId(currentPrimary.apiOperatorId, { primary: 'No' }); }
            const newPrimary = await ApiPartiesRepository.updateApiPartyDetailsByApiOperatorId(apiParty.apiOperatorId, { primary: 'Yes' });
            res.status(200).json({ status: 200, success: true, message: 'Primary operator changed successfully', data: newPrimary });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    //Static Methods Only For This Class (Not To Be Used In Routes)
    static async validateAndFetchApiOperatorByApiId(apiOperatorId) {
        await CommonHandler.validateSixDigitIdFormat(apiOperatorId);
        const apiParty = await ApiPartiesRepository.getApiPartyByApiOperatorId(apiOperatorId);
        if (!apiParty) throw new NotFoundError(`Api operator details not found for apiId ${apiOperatorId}.`);
        return apiParty;
    }

    static async validateApiPartiesData(data) {
        const { apiOperatorName, serviceName, category, apiOperatorCharges, ourCharges } = data;
        await CommonHandler.validateRequiredFields({ apiOperatorName, serviceName, category, apiOperatorCharges, ourCharges });

        const existingService = await ApiPartiesRepository.getApiPartyByServiceName(serviceName);
        if (!existingService) { data.primary = 'Yes'; }

        const serviceTable = await ServiceTableRepository.getServiceTableByServiceName(serviceName);
        if (!serviceTable) { throw new NotFoundError(`Service not found by the name of: ${serviceName}.`) }
        else { data.serviceId = serviceTable.serviceId; }

        return data;
    }
}
export default ApiPartiesController;