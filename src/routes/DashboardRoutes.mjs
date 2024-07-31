// src/routes/BankDetailsRoutes.mjs
import express from 'express';
import Middleware from '../project_setup/Middleware.mjs'
import DashboardController from '../controllers/DashboardController.mjs';

const router = express.Router();

// POST /Route to create a new user bank details
router.get('/getAdminApiHitCountStats', Middleware.admin, DashboardController.getAdminApiHitCountStats);

router.get('/getUserApiHitCountStats', Middleware.user, DashboardController.getUserApiHitCountStats);

router.get('/getAdminGraphStats', Middleware.admin, DashboardController.getAdminGraphStats);

router.get('/getUserGraphStats', Middleware.user, DashboardController.getUserGraphStats);

export default router;