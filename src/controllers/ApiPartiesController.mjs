import ApiPartiesRepository from "../repositories/ApiPartiesRepository.mjs";
import { CommonHandler, ValidationError, NotFoundError } from './CommonHandler.mjs';

class ApiPartiesController{
    static async createApiParty(req, res) {
        try {
            const apiPartiesData = await ApiPartiesController.validateApiPartiesData(req.body);
            const apiParty = await ApiPartiesRepository.createApiParty(apiPartiesData);
            res.status(201).json({ status: 201, success: true, message: 'Api party created successfully', data: apiParty });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    //Static Methods Only For This Class (Not To Be Used In Routes)
    static async validateApiPartiesData(data) {
        const { apiOperatorName, operationName, category, apiOperatorCharges, ourCharges, primary, status } = data;
        await CommonHandler.validateRequiredFields({ apiOperatorName, operationName, category, apiOperatorCharges, ourCharges });

        const existingOperation = await ApiPartiesRepository.getApiPartyByOperationName( operationName );
        if (!existingOperation) data.primary = 'Yes';

        
        return data;
    }
}
export default ApiPartiesController;