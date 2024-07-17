//src/routes/VerifyPanRoutes.mjs
import express from 'express';
import ApiPartiesController from '../controllers/ApiPartiesController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to create a new user
router.post('/createApiParty', Middleware.admin, ApiPartiesController.createApiParty);

// POST /Route to create a new user
router.put('/changePrimary/:apiOperatorId', Middleware.admin, ApiPartiesController.changePrimary);

export default router;