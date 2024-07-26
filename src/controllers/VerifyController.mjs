// src/controllers/VerifyController.mjs
import ApiPartiesRepository from '../repositories/ApiPartiesRepository.mjs';
import WalletRepository from '../repositories/WalletRepository.mjs';
import TransactionHistoryRepository from '../repositories/TransactionHistoryRepository.mjs';
import UserApikeyRepository from '../repositories/UserApiKeyRepository.mjs';
import {
    verifyPanLiteByZoop, verifyPanAdvanceByZoop, verifyPanDemographicByZoop, verifyDrivingLicenceAdvanceByZoop,
    verifyVoterAdvanceByZoop, verifyPassportLiteByZoop, verifyCkycLiteByZoop, verifyOkycLiteByZoop,
    verifyOkycOtpLiteByZoop, verifyGstinLiteByZoop, verifyGstinAdvanceByZoop, verifyBankAccountLiteByZoop,
    verifyRcLiteByZoop, verifyRcAdvanceByZoop, verifyIfscLiteByZoop, verifyOcrLiteByZoop,
    verifyEpfoProByZoop, verifyPan206AbByZoop, verifyPanMicroByZoop, verifyPanProByZoop,
    verifyPassportAdvanceByZoop, verifyCinAdvanceByZoop, verifyFssaiByZoop, verifyGstPanByZoop,
    verifyUdyogAadhaarByZoop, verifyCorporateVerificationByZoop, verifyChequeOcrByZoop, verifyEmailVerificationRequestByZoop,
    verifyEmailVerificationSubmitByZoop, verifyAadhaarEsignByZoop, verifyFaceCropByZoop, verifyFaceMatchByZoop
} from '../services/ZoopServices.mjs';
import { CommonHandler, ValidationError, NotFoundError, ApiError,MiddlewareError } from './CommonHandler.mjs';

class VerifyController {
    static SERVICES = {
        PAN_LITE: 'PAN CARD', PAN_ADVANCE: 'PAN CARD ADVANCE', PAN_DEMOGRAPHIC: 'PAN CARD DEMOGRAPHIC',
        VOTER_ADVANCE: 'VOTER ADVANCE', DL_ADVANCE: 'DRIVING LICENCE ADVANCE', PASSPORT_LITE: 'PASSPORT LITE', CKYC_LITE: 'CKYC LITE',
        OKYC_LITE: 'OKYC LITE', GSTIN_LITE: 'GSTIN LITE', GSTIN_ADVANCE: 'GSTIN ADVANCE',
        BANK_VERIFICATION_LITE: 'BANK VERIFICATION LITE', RC_LITE: 'RC LITE', RC_ADVANCE: 'RC ADVANCE',
        IFSC_LITE: 'IFSC LITE', OCR_LITE: 'OCR LITE', EPFO_PRO: 'EPFO PRO', PAN_206AB: 'PAN 206AB',
        PAN_MICRO: 'PAN MICRO', PAN_PRO: 'PAN PRO', PASSPORT_ADVANCE: 'PASSPORT ADVANCE', CIN_ADVANCE: 'CIN ADVANCE',
        FSSAI: 'FSSAI', GST_PAN: 'GST PAN', UDYOG_AADHAAR: 'UDYOG AADHAAR', CORPORATE_VERIFICATION: 'CORPORATE VERIFICATION',
        CHEQUE_OCR: 'CHEQUE OCR', EMAIL_VERIFICATION_REQUEST: 'EMAIL VERIFICATION REQUEST', AADHAAR_ESIGN: "AADHAAR ESIGN",
        FACE_CROP: 'FACE CROP', FACE_MATCH: 'FACE MATCH'
    };
    
    static OPERATORS = { ZOOP: 'ZOOP', SCRIZA: 'SCRIZA' };

    static async verifyDocument(req, res, serviceType, verifyByZoop, verifyByScriza) {
        try {
            //console.log(req);
            const apiKey = req.headers['api-key'];
            const userId = req.user?.userId || (await UserApikeyRepository.getUserApiKeyByApiKey(apiKey))?.userId;
            if (!userId) throw new MiddlewareError('Token or API-Key not found in the request');

            const userIP = req.ip;
            // console.log(userIP);

            const documentDetails = { ...req.body };  
            const documentNumber = documentDetails[Object.keys(documentDetails)[0]].toUpperCase();

            console.log(documentDetails);

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
            console.log(result);
            //console.log(result.response_message);
            if (result.response_message === 'Valid Authentication') {
                await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `${serviceType} verification, Api response:${result.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                res.status(200).json({ status: 200, success: true, message: `User ${serviceType} details fetched successfully`, data: result });
            } else {

                if (result.data && result.data.response_message) {
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `${serviceType} verification, Api response:${result.data.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    throw new ApiError(result.data.response_message);
                }
                else if (result.response_message) {
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `${serviceType} verification, Api response:${result.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    throw new ApiError(result.response_message);
                } else {
                    throw new ApiError('Unknown error occurred during verification');
                }
            }
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async verifyPanLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_LITE, verifyPanLiteByZoop, null); }

    static async verifyPanAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_ADVANCE, verifyPanAdvanceByZoop, null); }

    static async verifyPanDemographic(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_DEMOGRAPHIC, verifyPanDemographicByZoop, null); }

    static async verifyDrivingLicenceAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.DL_ADVANCE, verifyDrivingLicenceAdvanceByZoop, null); }

    static async verifyVoterAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.VOTER_ADVANCE, verifyVoterAdvanceByZoop, null); }

    static async verifyPassportLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PASSPORT_LITE, verifyPassportLiteByZoop, null); }

    static async verifyCkycLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.CKYC_LITE, verifyCkycLiteByZoop, null); }

    static async verifyOkycLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.OKYC_LITE, verifyOkycLiteByZoop, null); }

    static async verifyOkycOtpLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.OKYC_LITE, verifyOkycOtpLiteByZoop, null); }

    static async verifyGstinLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.GSTIN_LITE, verifyGstinLiteByZoop, null); }

    static async verifyGstinAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.GSTIN_ADVANCE, verifyGstinAdvanceByZoop, null); }

    static async verifyBankAccountLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.BANK_VERIFICATION_LITE, verifyBankAccountLiteByZoop, null); }

    static async verifyRcLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.RC_LITE, verifyRcLiteByZoop, null); }

    static async verifyRcAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.RC_ADVANCE, verifyRcAdvanceByZoop, null); }

    static async verifyIfscLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.IFSC_LITE, verifyIfscLiteByZoop, null); }

    static async verifyOcrLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.OCR_LITE, verifyOcrLiteByZoop, null); }

    static async verifyEpfoPro(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.EPFO_PRO, verifyEpfoProByZoop, null); }

    static async verifyPan206Ab(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_206AB, verifyPan206AbByZoop, null); }

    static async verifyPanMicro(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_MICRO, verifyPanMicroByZoop, null); }

    static async verifyPanPro(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_PRO, verifyPanProByZoop, null); }

    static async verifyPassportAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PASSPORT_ADVANCE, verifyPassportAdvanceByZoop, null); }

    static async verifyCinAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.CIN_ADVANCE, verifyCinAdvanceByZoop, null); }

    static async verifyFssai(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.FSSAI, verifyFssaiByZoop, null); }

    static async verifyGstPan(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.GST_PAN, verifyGstPanByZoop, null); }

    static async verifyUdyogAadhaar(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.UDYOG_AADHAAR, verifyUdyogAadhaarByZoop, null); }

    static async verifyCorporateVerification(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.CORPORATE_VERIFICATION, verifyCorporateVerificationByZoop, null); }

    static async verifyChequeOcr(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.CHEQUE_OCR, verifyChequeOcrByZoop, null); }

    static async verifyEmailVerificationRequest(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.EMAIL_VERIFICATION_REQUEST, verifyEmailVerificationRequestByZoop, null); }

    static async verifyEmailVerificationSubmit(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.EMAIL_VERIFICATION_REQUEST, verifyEmailVerificationSubmitByZoop, null); }

    static async verifyAadhaarEsign(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.AADHAAR_ESIGN, verifyAadhaarEsignByZoop, null); }

    static async verifyFaceCrop(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.FACE_CROP, verifyFaceCropByZoop, null); }

    static async verifyFaceMatch(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.FACE_MATCH, verifyFaceMatchByZoop, null); }
}

export default VerifyController;