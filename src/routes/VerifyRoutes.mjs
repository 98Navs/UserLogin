//src/routes/VerifyPanRoutes.mjs
import express from 'express';
import VerifyController from '../controllers/VerifyController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to Verify PAN Card Details
router.post('/verifyPanLite', Middleware.user, VerifyController.verifyPanLite);

router.post('/verifyPanAdvance', Middleware.user, VerifyController.verifyPanAdvance);

router.post('/verifyPanDemographic', Middleware.user, VerifyController.verifyPanDemographic);

router.post('/verifyDrivingLicenceAdvance', Middleware.user, VerifyController.verifyDrivingLicenceAdvance);

router.post('/verifyVoterAdvance', Middleware.user, VerifyController.verifyVoterAdvance);

router.post('/verifyPassportLite', Middleware.user, VerifyController.verifyPassportLite);

router.post('/verifyCkycLite', Middleware.user, VerifyController.verifyCkycLite);

router.post('/verifyOkycLite', Middleware.user, VerifyController.verifyOkycLite);

router.post('/verifyOkycOtpLite', Middleware.user, VerifyController.verifyOkycOtpLite);

export default router;