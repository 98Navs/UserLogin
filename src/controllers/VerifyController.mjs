// src/controllers/VerifyController.mjs
import dayjs from 'dayjs';
import ApiPartiesRepository from '../repositories/ApiPartiesRepository.mjs';
import TransactionHistoryRepository from '../repositories/TransactionHistoryRepository.mjs';
import UserRepository from '../repositories/UserRepository.mjs';
import * as ZoopServices from '../services/ZoopServices.mjs';
import { CommonHandler, ValidationError, NotFoundError, ApiError, MiddlewareError } from './CommonHandler.mjs';
import PackageSetupRepository from '../repositories/PackageSetupRepository.mjs';

class VerifyController {
    // Service and Operator constants
    static SERVICES = { PAN_LITE: 'PAN CARD', PAN_ADVANCE: 'PAN CARD ADVANCE', PAN_DEMOGRAPHIC: 'PAN CARD DEMOGRAPHIC', VOTER_ADVANCE: 'VOTER ADVANCE', DL_ADVANCE: 'DRIVING LICENCE ADVANCE', PASSPORT_LITE: 'PASSPORT LITE', CKYC_LITE: 'CKYC LITE', OKYC_LITE: 'OKYC LITE', GSTIN_LITE: 'GSTIN LITE', GSTIN_ADVANCE: 'GSTIN ADVANCE', BANK_VERIFICATION_LITE: 'BANK VERIFICATION LITE', RC_LITE: 'RC LITE', RC_ADVANCE: 'RC ADVANCE', IFSC_LITE: 'IFSC LITE', OCR_LITE: 'OCR LITE', EPFO_PRO: 'EPFO PRO', PAN_206AB: 'PAN 206AB', PAN_MICRO: 'PAN MICRO', PAN_PRO: 'PAN PRO', PASSPORT_ADVANCE: 'PASSPORT ADVANCE', CIN_ADVANCE: 'CIN ADVANCE', FSSAI: 'FSSAI', GST_PAN: 'GST PAN', UDYOG_AADHAAR: 'UDYOG AADHAAR', CORPORATE_VERIFICATION: 'CORPORATE VERIFICATION', CHEQUE_OCR: 'CHEQUE OCR', EMAIL_VERIFICATION_REQUEST: 'EMAIL VERIFICATION REQUEST', AADHAAR_ESIGN: "AADHAAR ESIGN", FACE_CROP: 'FACE CROP', FACE_MATCH: 'FACE MATCH' };
    static OPERATORS = { ZOOP: 'ZOOP', SCRIZA: 'SCRIZA' };
    
    // Main document verification method
    static async verifyDocument(req, res, serviceType, verifyByZoop, verifyByScriza) {
        try {
            const apiKey = req.headers['api-key'];
            const userId = req.user?.userId || (await UserRepository.getUserApiKeyByApiKey(apiKey))?.userId;
            if (!userId) throw new MiddlewareError('Token or API-Key not found in the request');

            const userIp = req.ip;
            const user = await UserRepository.getUserByUserId(userId);
            if (!user) throw new NotFoundError(`User not found for userId: ${userId}`);
            if (user.whiteListIp.length > 0 && !user.whiteListIp.includes(userIp)) { throw new MiddlewareError(`User IP is not in the whitelist, Currently IP being used is ${userIp}`); }
            
            const documentDetails = { ...req.body };

            const apiParty = await ApiPartiesRepository.getCurrentPrimaryByServiceName(serviceType);
            if (!apiParty) throw new NotFoundError(`Api party not found for: ${serviceType}`);

            const packageSetup = await PackageSetupRepository.getPackageSetupByPackageName(user.packageName);
            const packageServiceCharge = packageSetup.servicesProvided.find(service => service.serviceType === serviceType);

            // Handle service verification and wallet update
            const today = dayjs();
            const userService = user.packageDetails.find(service => service.serviceType === serviceType);
            if (!userService || userService.status !== 'Active' || today.isAfter(dayjs(userService.serviceLifeEnds))) { throw new ValidationError(`Service ${serviceType} is either not included, inactive, or expired in the user's package.`); }

            const charge = userService.serviceLimit > 0 ? packageServiceCharge.serviceCharges : (await PackageSetupRepository.getPackageSetupByPackageName('DEFAULT PACKAGE')).servicesProvided.find(service => service.serviceType === serviceType).serviceCharges;
            if (user.amount < charge) {  throw new ValidationError(`Insufficient funds in user account. Balance: RS: ${user.amount}, Charge: RS: ${charge}`); }
            userService.serviceLimit = Math.max(0, userService.serviceLimit - 1);
            user.amount -= charge;
            await user.save();
            
            // Record transaction
            const transactionHistoryData = { userId: userId, userName: user.userName, serviceName: apiParty.serviceName, apiOperatorName: apiParty.apiOperatorName, category: apiParty.category, amount: charge, type: 'Debit', reason: `${serviceType} verification, User input: ${JSON.stringify(documentDetails)} `, gstNumber: user.gstNumber };
            const transaction = await TransactionHistoryRepository.createTransactionHistory(transactionHistoryData);

            // Verify document with the appropriate service
            const verifyByOperator = { [VerifyController.OPERATORS.ZOOP]: verifyByZoop, [VerifyController.OPERATORS.SCRIZA]: verifyByScriza }[apiParty.apiOperatorName];
            if (!verifyByOperator) throw new NotFoundError('Operator not found');
            
            const result = await verifyByOperator(documentDetails);
            const responseMessage = result.response_message || result.data?.response_message || 'Unknown error occurred during verification';
            await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { endResult: `Api response: ${responseMessage}, Api result: ${await CommonHandler.safeStringify(result)}`, status: 'Complete' });

            // Result handling
            if (result.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User ${serviceType} details fetched successfully`, data: result }); }
            else { throw new ApiError(responseMessage); }
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    // Specific document verification methods
    static async verifyPanLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_LITE, ZoopServices.verifyPanLiteByZoop, null); }

    static async verifyPanAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_ADVANCE, ZoopServices.verifyPanAdvanceByZoop, null); }

    static async verifyPanDemographic(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_DEMOGRAPHIC, ZoopServices.verifyPanDemographicByZoop, null); }

    static async verifyDrivingLicenceAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.DL_ADVANCE, ZoopServices.verifyDrivingLicenceAdvanceByZoop, null); }

    static async verifyVoterAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.VOTER_ADVANCE, ZoopServices.verifyVoterAdvanceByZoop, null); }

    static async verifyPassportLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PASSPORT_LITE, ZoopServices.verifyPassportLiteByZoop, null); }

    static async verifyCkycLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.CKYC_LITE, ZoopServices.verifyCkycLiteByZoop, null); }

    static async verifyOkycLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.OKYC_LITE, ZoopServices.verifyOkycLiteByZoop, null); }

    static async verifyOkycOtpLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.OKYC_LITE, ZoopServices.verifyOkycOtpLiteByZoop, null); }

    static async verifyGstinLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.GSTIN_LITE, ZoopServices.verifyGstinLiteByZoop, null); }

    static async verifyGstinAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.GSTIN_ADVANCE, ZoopServices.verifyGstinAdvanceByZoop, null); }

    static async verifyBankAccountLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.BANK_VERIFICATION_LITE, ZoopServices.verifyBankAccountLiteByZoop, null); }

    static async verifyRcLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.RC_LITE, ZoopServices.verifyRcLiteByZoop, null); }

    static async verifyRcAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.RC_ADVANCE, ZoopServices.verifyRcAdvanceByZoop, null); }

    static async verifyIfscLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.IFSC_LITE, ZoopServices.verifyIfscLiteByZoop, null); }

    static async verifyOcrLite(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.OCR_LITE, ZoopServices.verifyOcrLiteByZoop, null); }

    static async verifyEpfoPro(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.EPFO_PRO, ZoopServices.verifyEpfoProByZoop, null); }

    static async verifyPan206Ab(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_206AB, ZoopServices.verifyPan206AbByZoop, null); }

    static async verifyPanMicro(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_MICRO, ZoopServices.verifyPanMicroByZoop, null); }

    static async verifyPanPro(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PAN_PRO, ZoopServices.verifyPanProByZoop, null); }

    static async verifyPassportAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.PASSPORT_ADVANCE, ZoopServices.verifyPassportAdvanceByZoop, null); }

    static async verifyCinAdvance(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.CIN_ADVANCE, ZoopServices.verifyCinAdvanceByZoop, null); }

    static async verifyFssai(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.FSSAI, ZoopServices.verifyFssaiByZoop, null); }

    static async verifyGstPan(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.GST_PAN, ZoopServices.verifyGstPanByZoop, null); }

    static async verifyUdyogAadhaar(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.UDYOG_AADHAAR, ZoopServices.verifyUdyogAadhaarByZoop, null); }

    static async verifyCorporateVerification(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.CORPORATE_VERIFICATION, ZoopServices.verifyCorporateVerificationByZoop, null); }

    static async verifyChequeOcr(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.CHEQUE_OCR, ZoopServices.verifyChequeOcrByZoop, null); }

    static async verifyEmailVerificationRequest(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.EMAIL_VERIFICATION_REQUEST, ZoopServices.verifyEmailVerificationRequestByZoop, null); }

    static async verifyEmailVerificationSubmit(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.EMAIL_VERIFICATION_REQUEST, ZoopServices.verifyEmailVerificationSubmitByZoop, null); }

    static async verifyAadhaarEsign(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.AADHAAR_ESIGN, ZoopServices.verifyAadhaarEsignByZoop, null); }

    static async verifyFaceCrop(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.FACE_CROP, ZoopServices.verifyFaceCropByZoop, null); }

    static async verifyFaceMatch(req, res) { await VerifyController.verifyDocument(req, res, VerifyController.SERVICES.FACE_MATCH, ZoopServices.verifyFaceMatchByZoop, null); }
}
export default VerifyController;