// src/routes/BankDetailsRoutes.mjs
import express from 'express';
import Middleware from '../project_setup/Middleware.mjs'
import DashboardController from '../controllers/DashboardController.mjs';

const router = express.Router();

// GET /Route to get admin api hit counts stats
router.get('/getAdminApiHitCountStats', Middleware.admin, DashboardController.getAdminApiHitCountStats);

// GET /Route to get user api hit counts stats
router.get('/getUserApiHitCountStats', Middleware.user, DashboardController.getUserApiHitCountStats);

// GET /Route to get admin graph stats
router.get('/getAdminGraphStats', Middleware.admin, DashboardController.getAdminGraphStats);

// GET /Route to get user graph stats
router.get('/getUserGraphStats', Middleware.user, DashboardController.getUserGraphStats);

// GET /Route to get user wallet details
router.get('/getWalletDetails', Middleware.user, DashboardController.getWalletDetails);

export default router;