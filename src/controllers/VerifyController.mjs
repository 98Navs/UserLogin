// src/controllers/VerifyController.mjs
import ApiPartiesRepository from '../repositories/ApiPartiesRepository.mjs';
import WalletRepository from '../repositories/WalletRepository.mjs';
import TransactionHistoryRepository from '../repositories/TransactionHistoryRepository.mjs';
import { verifyPanLiteByZoop, verifyPanAdvanceByZoop, verifyPanDemographicByZoop, verifyDrivingLicenceAdvanceByZoop, verifyVoterAdvanceByZoop, verifyPassportLiteByZoop, verifyCkycLiteByZoop, verifyOkycLiteByZoop, verifyOkycOtpLiteByZoop } from '../services/ZoopServices.mjs';
import { CommonHandler, ValidationError, NotFoundError, ApiError } from './CommonHandler.mjs';

class VerifyController {
    static SERVICES = { PAN_LITE: 'PAN CARD', PAN_ADVANCE: 'PAN CARD ADVANCE', PAN_DEMOGRAPHIC: 'PAN CARD DEMOGRAPHIC', VOTER: 'VOTER CARD', DL_ADVANCE: 'DRIVING LICENCE ADVANCE', PASSPORT_LITE: 'PASSPORT LITE', CKYC_LITE: 'CKYC LITE', OKYC_LITE: "OKYC LITE" };
    
    static OPERATORS = { ZOOP: 'ZOOP', SCRIZA: 'SCRIZA' };

    static async verifyDocument(req, res, serviceType, formatValidation, verifyByZoop, verifyByScriza) {
        try {
            const { userId } = req.user;
            const documentDetails = { ...req.body };
           
            const documentNumber = documentDetails[Object.keys(documentDetails)[0]].toUpperCase();
           // console.log(documentNumber);
            await formatValidation(documentNumber);

            const userWallet = await WalletRepository.getWalletByUserId(userId);
            if (!userWallet) throw new NotFoundError(`User wallet not found for userId: ${userId}`);

            const apiParty = await ApiPartiesRepository.getCurrentPrimaryByServiceName(serviceType);
            if (!apiParty) throw new NotFoundError(`Api party not found for: ${serviceType}`);

            if (userWallet.amount < apiParty.ourCharges) throw new ValidationError(`Insufficient funds. Current balance: RS: ${userWallet.amount}, service charge: RS: ${apiParty.ourCharges}`);
            userWallet.amount -= apiParty.ourCharges;
            await userWallet.save();

            const transactionHistoryData = { userId, serviceName: apiParty.serviceName, apiOperatorName: apiParty.apiOperatorName, category: apiParty.category, amount: apiParty.ourCharges, type: 'Debit', reason: `${serviceType} verification, User input:${documentNumber}, Result pending from:${apiParty.apiOperatorName}` };
            const transaction = await TransactionHistoryRepository.createTransactionHistory(transactionHistoryData);

            let result;
            switch (apiParty.apiOperatorName) {
                case VerifyController.OPERATORS.ZOOP:
                    result = await verifyByZoop(documentDetails);
                    break;
                case VerifyController.OPERATORS.SCRIZA:
                    result = await verifyByScriza(documentDetails);
                    break;
                default:
                    throw new NotFoundError('Operator not found');
            }
            //console.log(result);
            if (result.response_message === 'Valid Authentication') {
                await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `${serviceType} verification, Api response:${result.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                res.status(200).json({ status: 200, success: true, message: `User ${serviceType} details fetched successfully`, data: result });
            } else {
                await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `${serviceType} verification, Api response:${result.data.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                throw new ApiError(result.data.response_message);
            }
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async verifyPanLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_LITE, CommonHandler.validatePanCardFormat, verifyPanLiteByZoop, null); }

    static async verifyPanAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_ADVANCE, CommonHandler.validatePanCardFormat, verifyPanAdvanceByZoop, null); }

    static async verifyPanDemographic(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_DEMOGRAPHIC, CommonHandler.validatePanCardFormat, verifyPanDemographicByZoop, null); }

    static async verifyDrivingLicenceAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.DL_ADVANCE, CommonHandler.validateDrivingLicenseFormat, verifyDrivingLicenceAdvanceByZoop, null); }

    static async verifyVoterAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.VOTER, CommonHandler.validateVoterEpicFormat, verifyVoterAdvanceByZoop, null); }

    static async verifyPassportLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PASSPORT_LITE, CommonHandler.validatePassportFormat, verifyPassportLiteByZoop, null); }

    static async verifyCkycLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.CKYC_LITE, CommonHandler.validatePanCardFormat, verifyCkycLiteByZoop, null); }

    static async verifyOkycLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.OKYC_LITE, CommonHandler.validateAadhaarFormat, verifyOkycLiteByZoop, null); }

    static async verifyOkycOtpLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.OKYC_LITE, () => true, verifyOkycOtpLiteByZoop, null); }
}

export default VerifyController;