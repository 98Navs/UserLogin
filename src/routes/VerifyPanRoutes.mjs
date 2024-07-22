//src/routes/VerifyPanRoutes.mjs
import express from 'express';
import VerifyPanController from '../controllers/VerifyPanController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to Verify PAN Card Details
router.post('/verifyPanLite', Middleware.user, VerifyPanController.verifyPanLite);

router.post('/verifyVoterAdvance', Middleware.user, VerifyPanController.verifyVoterAdvance);


export default router;