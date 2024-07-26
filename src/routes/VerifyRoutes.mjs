//src/routes/VerifyRoutes.mjs
import express from 'express';
import VerifyController from '../controllers/VerifyController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to Verify PAN Card Details
router.post('/verifyPanLite', Middleware.optionalMiddleware, VerifyController.verifyPanLite);

router.post('/verifyPanAdvance', Middleware.optionalMiddleware, VerifyController.verifyPanAdvance);

router.post('/verifyPanDemographic', Middleware.optionalMiddleware, VerifyController.verifyPanDemographic);

router.post('/verifyDrivingLicenceAdvance', Middleware.optionalMiddleware, VerifyController.verifyDrivingLicenceAdvance);

router.post('/verifyVoterAdvance', Middleware.optionalMiddleware, VerifyController.verifyVoterAdvance);

router.post('/verifyPassportLite', Middleware.optionalMiddleware, VerifyController.verifyPassportLite);

router.post('/verifyCkycLite', Middleware.optionalMiddleware, VerifyController.verifyCkycLite);

router.post('/verifyOkycLite', Middleware.optionalMiddleware, VerifyController.verifyOkycLite);

router.post('/verifyOkycOtpLite', Middleware.optionalMiddleware, VerifyController.verifyOkycOtpLite);

router.post('/verifyGstinLite', Middleware.optionalMiddleware, VerifyController.verifyGstinLite);

router.post('/verifyGstinAdvance', Middleware.optionalMiddleware, VerifyController.verifyGstinAdvance);

router.post('/verifyBankAccountLite', Middleware.optionalMiddleware, VerifyController.verifyBankAccountLite);

router.post('/verifyRcLite', Middleware.optionalMiddleware, VerifyController.verifyRcLite);

router.post('/verifyRcAdvance', Middleware.optionalMiddleware, VerifyController.verifyRcAdvance);

router.post('/verifyIfscLite', Middleware.optionalMiddleware, VerifyController.verifyIfscLite);

router.post('/verifyOcrLite', Middleware.optionalMiddleware, VerifyController.verifyOcrLite);

router.post('/verifyEpfoPro', Middleware.optionalMiddleware, VerifyController.verifyEpfoPro);

router.post('/verifyPan206Ab', Middleware.optionalMiddleware, VerifyController.verifyPan206Ab);

router.post('/verifyPanMicro', Middleware.optionalMiddleware, VerifyController.verifyPanMicro);

router.post('/verifyPanPro', Middleware.optionalMiddleware, VerifyController.verifyPanPro);

router.post('/verifyPassportAdvance', Middleware.optionalMiddleware, VerifyController.verifyPassportAdvance);

router.post('/verifyCinAdvance', Middleware.optionalMiddleware, VerifyController.verifyCinAdvance);

router.post('/verifyFssai', Middleware.optionalMiddleware, VerifyController.verifyFssai);

router.post('/verifyGstPan', Middleware.optionalMiddleware, VerifyController.verifyGstPan);

router.post('/verifyUdyogAadhaar', Middleware.optionalMiddleware, VerifyController.verifyUdyogAadhaar);

router.post('/verifyCorporateVerification', Middleware.optionalMiddleware, VerifyController.verifyCorporateVerification);

router.post('/verifyChequeOcr', Middleware.optionalMiddleware, VerifyController.verifyChequeOcr);

router.post('/verifyEmailVerificationRequest', Middleware.optionalMiddleware, VerifyController.verifyEmailVerificationRequest);

router.post('/verifyEmailVerificationSubmit', Middleware.optionalMiddleware, VerifyController.verifyEmailVerificationSubmit);

router.post('/verifyAadhaarEsign', Middleware.optionalMiddleware, VerifyController.verifyAadhaarEsign);

router.post('/verifyFaceCrop', Middleware.optionalMiddleware, VerifyController.verifyFaceCrop);

router.post('/verifyFaceMatch', Middleware.optionalMiddleware, VerifyController.verifyFaceMatch)

export default router;