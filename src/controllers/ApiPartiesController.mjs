import ApiPartiesRepository from "../repositories/ApiPartiesRepository.mjs";
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

    static async changePrimary(req, res) {
        try {
            const { apiId } = req.params;
            const apiParty = await ApiPartiesController.validateAndFetchApiOperatorByApiId(apiId);
            const currentPrimary = await ApiPartiesRepository.getCurrentPrimaryByOperationName(apiParty.operationName);
            if (currentPrimary) { await ApiPartiesRepository.updateApiPartyDetailsByApiId(currentPrimary.apiId, { primary: 'No' }); }
            const newPrimary = await ApiPartiesRepository.updateApiPartyDetailsByApiId(apiParty.apiId, { primary: 'Yes' });
            res.status(200).json({ status: 200, success: true, message: 'Primary operator changed successfully', data: newPrimary });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    //Static Methods Only For This Class (Not To Be Used In Routes)
    static async validateAndFetchApiOperatorByApiId(apiId) {
        await CommonHandler.validateSixDigitIdFormat(apiId);
        const apiParty = await ApiPartiesRepository.getApiPartyByApiId(apiId);
        if (!apiParty) throw new NotFoundError(`Api operator details not found for apiId ${apiId}.`);
        return apiParty;
    }

    static async validateApiPartiesData(data) {
        const { apiOperatorName, serviceName, serviceId, category, apiOperatorCharges, ourCharges, primary, status } = data;
        await CommonHandler.validateRequiredFields({ apiOperatorName, serviceId, category, apiOperatorCharges, ourCharges });

        const existingOperation = await ApiPartiesRepository.getApiPartyByOperationName(serviceId);
        if (!existingOperation) data.primary = 'Yes';


        return data;
    }
}
export default ApiPartiesController;