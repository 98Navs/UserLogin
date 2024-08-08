//src/routes/UserRoutes.mjs
import express from 'express';
import UserController from '../controllers/UserController.mjs';
import UserRegistrationController from '../controllers/UserRegistrationController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to create a new user
router.post('/createUser', UserRegistrationController.createUser);

// POST /Route for user to signIn
router.post('/signIn', UserRegistrationController.signIn);

// POST /Route for user to signOut
router.post('/signOut', Middleware.user, UserRegistrationController.signOut);

// POST /Route for user to apply for forgetPassword
router.post('/forgetPassword', UserRegistrationController.forgetPassword);

// POST /Route for user confirm otp
router.post('/otp', UserRegistrationController.otp);

// POST /Route for user to changePassword
router.post('/changePassword', UserRegistrationController.changePassword);

// GET /Route to get all users
router.get('/getAllUsers', Middleware.admin, UserController.getAllUsers);

// GET /Route to get user details by userId
router.get('/getUserByUserId/:userId', Middleware.admin, UserController.getUserByUserId);

// GET /Route to get user login logs details
router.get('/getUserLoginLogs', Middleware.user, UserController.getUserLoginLogs);

//GET /Route to get all available service type by service name
router.get('/getAllAvailableServiceTypeByPackageName', Middleware.user, UserController.getAllAvailableServiceTypeByPackageName)

//GET /Route to get all available package setup names
router.get('/getAllAvailablePackageSetupNames', Middleware.user, UserController.getAllAvailablePackageSetupNames);

//GET /Route to get area details by pin code
router.get('/getAreaDetailsByPinCode', Middleware.user, UserController.getAreaDetailsByPinCode);

// PUT /Route to update user details bu userId
router.put('/updateUserByUserId/:userId', Middleware.user, UserController.updateUserByUserId);

// PUT /Route to update user api key for user
router.put('/updateUserApiKey', Middleware.user, UserController.updateUserApiKey);

// DELETE /Route to delete the user by userId
router.delete('/deleteUserByUserId/:userId', Middleware.user, UserController.deleteUserByUserId);

export default router;