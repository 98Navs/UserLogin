//src/routes/PackageSetupRoutes.mjs
import express from 'express';
import PackageSetupController from '../controllers/PackageSetupController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to create a package setup
router.post('/createPackageSetup', Middleware.admin, PackageSetupController.createPackageSetup);

// GET /Route to fetch all package setup
router.get('/getAllPackageSetup', Middleware.admin, PackageSetupController.getAllPackageSetup);

// PUT /Route to update a package setup by package name
router.put('/updatePackageSetupByPackageName/:packageName', Middleware.admin, PackageSetupController.updatePackageSetupByPackageName);

// DELETE /Route to delete a package setup by package name
router.delete('/deletePackageSetupByPackageName/:packageName', Middleware.admin, PackageSetupController.deletePackageSetupByPackageName)

export default router;