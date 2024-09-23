//src/routes/ApiPartiesRoutes.mjs
import express from 'express';
import ApiPartiesController from '../controllers/ApiPartiesController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to create a new api party
router.post('/createApiParty', Middleware.admin, ApiPartiesController.createApiParty);

// GET /Route to fetch Api input keys by serviceId
router.get('/getPrimaryApiInputKeysByServiceName', Middleware.user, ApiPartiesController.getPrimaryApiInputKeysByServiceName);

// GET /Route to fetch all api parties
router.get('/getAllApiParties', Middleware.admin, ApiPartiesController.getAllApiParties);

// GET /Route to fetch api operators name by service name
router.get('/getApiOperatorsNamesByServiceId/:serviceId', Middleware.admin, ApiPartiesController.getApiOperatorsNamesByServiceName);

// POST /Route to create a new user
router.put('/changePrimaryByServiceIdAndApiOperatorName/:serviceId/:apiOperatorName', Middleware.admin, ApiPartiesController.changePrimaryByServiceNameAndApiOperatorName);

export default router;