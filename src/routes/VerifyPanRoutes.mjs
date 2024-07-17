//src/routes/VerifyPanRoutes.mjs
import express from 'express';
import VerifyPanController from '../controllers/VerifyPanController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to create a new user
router.post('/verifyPan', Middleware.user, VerifyPanController.verifyPan);

export default router;