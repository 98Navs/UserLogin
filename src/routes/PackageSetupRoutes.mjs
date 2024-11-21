//src/routes/PackageSetupRoutes.mjs
import express from 'express';
import PackageSetupController from '../controllers/PackageSetupController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to create a package setup
router.post('/createPackageSetup', Middleware.admin, PackageSetupController.createPackageSetup);

// GET /Route to fetch all package setup
router.get('/getAllPackageSetup', Middleware.admin, PackageSetupController.getAllPackageSetup);

// GET /Route to fetch package setup by packageId
router.get('/getPackageByPackageId/:packageId', Middleware.admin, PackageSetupController.getPackageByPackageId);

// PUT /Route to update a package setup by packageId
router.put('/updatePackageSetupByPackageId/:packageId', Middleware.admin, PackageSetupController.updatePackageSetupByPackageId);

// DELETE /Route to delete a package setup by packageId
router.delete('/deletePackageSetupByPackageId/:packageId', Middleware.admin, PackageSetupController.deletePackageSetupByPackageId)

export default router;