//src/routes/VerifyRoutes.mjs
import express from 'express';
import VerifyController from '../controllers/VerifyController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to Verify PAN Lite Details
router.post('/verifyPanLite', Middleware.optionalMiddleware, VerifyController.verifyPanLite);

// POST /Route to Verify PAN Advance Details
router.post('/verifyPanAdvance', Middleware.optionalMiddleware, VerifyController.verifyPanAdvance);

// POST /Route to Verify PAN Demographic Details
router.post('/verifyPanDemographic', Middleware.optionalMiddleware, VerifyController.verifyPanDemographic);

// POST /Route to Verify PAN Pro 206 Ab Details
router.post('/verifyPan206Ab', Middleware.optionalMiddleware, VerifyController.verifyPan206Ab);

// POST /Route to Verify PAN Micro Details
router.post('/verifyPanMicro', Middleware.optionalMiddleware, VerifyController.verifyPanMicro);

// POST /Route to Verify PAN Pro Details
router.post('/verifyPanPro', Middleware.optionalMiddleware, VerifyController.verifyPanPro);

// POST /Route to Verify Driving Licence Advance Details
router.post('/verifyDrivingLicenceAdvance', Middleware.optionalMiddleware, VerifyController.verifyDrivingLicenceAdvance);

// POST /Route to Verify Voter Advance Details
router.post('/verifyVoterAdvance', Middleware.optionalMiddleware, VerifyController.verifyVoterAdvance);

// POST /Route to Verify Passport Lite Details
router.post('/verifyPassportLite', Middleware.optionalMiddleware, VerifyController.verifyPassportLite);

// POST /Route to Verify Passport Advance Details
router.post('/verifyPassportAdvance', Middleware.optionalMiddleware, VerifyController.verifyPassportAdvance);

// POST /Route to Verify CKYC Lite Details
router.post('/verifyCkycLite', Middleware.optionalMiddleware, VerifyController.verifyCkycLite);

// POST /Route to Verify OKYC Lite Details
router.post('/verifyOkycLite', Middleware.optionalMiddleware, VerifyController.verifyOkycLite);

// POST /Route to Verify OKYC Otp Lite Details
router.post('/verifyOkycOtpLite', Middleware.optionalMiddleware, VerifyController.verifyOkycOtpLite);

// POST /Route to Verify GSTIN Lite Details
router.post('/verifyGstinLite', Middleware.optionalMiddleware, VerifyController.verifyGstinLite);

// POST /Route to Verify GSTIN Advance Details
router.post('/verifyGstinAdvance', Middleware.optionalMiddleware, VerifyController.verifyGstinAdvance);

// POST /Route to Verify Bank Account Lite Details
router.post('/verifyBankAccountLite', Middleware.optionalMiddleware, VerifyController.verifyBankAccountLite);

// POST /Route to Verify RC Lite Details
router.post('/verifyRcLite', Middleware.optionalMiddleware, VerifyController.verifyRcLite);

// POST /Route to Verify RC Advance Details
router.post('/verifyRcAdvance', Middleware.optionalMiddleware, VerifyController.verifyRcAdvance);

// POST /Route to Verify IFSC Lite Details
router.post('/verifyIfscLite', Middleware.optionalMiddleware, VerifyController.verifyIfscLite);

// POST /Route to Verify OCR Lite Details
router.post('/verifyOcrLite', Middleware.optionalMiddleware, VerifyController.verifyOcrLite);

// POST /Route to Verify EPFO Pro Details
router.post('/verifyEpfoPro', Middleware.optionalMiddleware, VerifyController.verifyEpfoPro);

// POST /Route to Verify CIN Advance Details
router.post('/verifyCinAdvance', Middleware.optionalMiddleware, VerifyController.verifyCinAdvance);

// POST /Route to Verify FSSAI Details
router.post('/verifyFssai', Middleware.optionalMiddleware, VerifyController.verifyFssai);

// POST /Route to Verify GST Pan Details
router.post('/verifyGstPan', Middleware.optionalMiddleware, VerifyController.verifyGstPan);

// POST /Route to Verify Udyog Aadhaar Details
router.post('/verifyUdyogAadhaar', Middleware.optionalMiddleware, VerifyController.verifyUdyogAadhaar);

// POST /Route to Verify Corporate Verification Details
router.post('/verifyCorporateVerification', Middleware.optionalMiddleware, VerifyController.verifyCorporateVerification);

// POST /Route to Verify Cheque OCR Details
router.post('/verifyChequeOcr', Middleware.optionalMiddleware, VerifyController.verifyChequeOcr);

// POST /Route to Verify Email Verification Request Details
router.post('/verifyEmailVerificationRequest', Middleware.optionalMiddleware, VerifyController.verifyEmailVerificationRequest);

// POST /Route to Verify Email Verification Submit Details
router.post('/verifyEmailVerificationSubmit', Middleware.optionalMiddleware, VerifyController.verifyEmailVerificationSubmit);

// POST /Route to Verify Aadhaar Esign Details
router.post('/verifyAadhaarEsign', Middleware.optionalMiddleware, VerifyController.verifyAadhaarEsign);

// POST /Route to Verify Face Crop Details
router.post('/verifyFaceCrop', Middleware.optionalMiddleware, VerifyController.verifyFaceCrop);

// POST /Route to Verify Face Match Details
router.post('/verifyFaceMatch', Middleware.optionalMiddleware, VerifyController.verifyFaceMatch)

export default router;