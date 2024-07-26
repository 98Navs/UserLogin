//src/routes/ApiPartiesRoutes.mjs
import express from 'express';
import ApiPartiesController from '../controllers/ApiPartiesController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to create a new user
router.post('/createApiParty', Middleware.admin, ApiPartiesController.createApiParty);

// POST /Route to create a new user
router.put('/changePrimaryByApiOperatorId/:apiOperatorId', Middleware.admin, ApiPartiesController.changePrimaryByApiOperatorId);

export default router;