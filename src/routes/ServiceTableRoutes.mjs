//src/routes/ServiceTableRoutes.mjs
import express from 'express';
import Middleware from '../project_setup/Middleware.mjs'
import ServiceTableController from '../controllers/ServiceTableController.mjs';

const router = express.Router();

// POST /Route to create a new user
router.post('/createServiceTable', Middleware.admin, ServiceTableController.createServiceTable);


export default router;