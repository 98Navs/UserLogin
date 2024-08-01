//src/routes/ApiPartiesRoutes.mjs
import express from 'express';
import ApiPartiesController from '../controllers/ApiPartiesController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to create a new api party
router.post('/createApiParty', Middleware.admin, ApiPartiesController.createApiParty);

// GET /Route to fetch Api input keys by serviceId
router.get('/getPrimaryApiInputKeysByServiceId', Middleware.user, ApiPartiesController.getPrimaryApiInputKeysByServiceId);

// POST /Route to create a new user
router.put('/changePrimaryByApiOperatorId/:apiOperatorId', Middleware.admin, ApiPartiesController.changePrimaryByApiOperatorId);

export default router;