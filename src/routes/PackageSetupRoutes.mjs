//src/routes/PackageSetupRoutes.mjs
import express from 'express';
import PackageSetupController from '../controllers/PackageSetupController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to create a package setup
router.post('/createPackageSetup', Middleware.admin, PackageSetupController.createPackageSetup);

export default router;