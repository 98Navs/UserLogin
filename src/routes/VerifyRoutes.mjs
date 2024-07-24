//src/routes/VerifyPanRoutes.mjs
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

export default router;