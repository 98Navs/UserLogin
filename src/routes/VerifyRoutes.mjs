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

export default router;