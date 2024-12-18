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
router.post('/sendOtp', UserRegistrationController.sendOtp);

// POST /Route for user confirm otp
router.post('/verifyOtp', UserRegistrationController.verifyOtp);

// POST /Route for user to changePassword
router.post('/changePassword', UserRegistrationController.changePassword);

// POST /Route for user to resetPassword
router.post('/resetPassword', Middleware.user, UserRegistrationController.resetPassword);

//GET /Route to get area details by pin code
router.get('/getAreaDetailsByPinCode', Middleware.user, UserRegistrationController.getAreaDetailsByPinCode);

//GET /Route to get all available service type by service name
router.get('/getAllAvailableServiceTypeByPackageName', Middleware.user, UserRegistrationController.getAllAvailableServiceTypeByPackageName)

//GET /Route to get all available package setup names
router.get('/getAllAvailablePackageSetupNames', Middleware.user, UserRegistrationController.getAllAvailablePackageSetupNames);

// GET /Route to get all users
router.get('/getAllUsers', UserController.getAllUsers);

// GET /Route to get user details by userId
router.get('/getUserByUserId/:userId', Middleware.user, UserController.getUserByUserId);

// GET /Route to get user details
router.get('/getUserDetails', Middleware.user, UserController.getUserDetails);

// GET /Route to get user login logs details
router.get('/getUserLoginLogs', Middleware.user, UserController.getUserLoginLogs);

// GET /Route to get user active service types
router.get('/getUserServicesByUserId', Middleware.user, UserController.getUserServicesByUserId);

// GET /Route to get user api key by userId
router.get('/getUserApiKeyByUserId', Middleware.user, UserController.getUserApiKeyByUserId);

// GET /Route to get user white list ip by userId
router.get('/getUserWhiteListIpByUserId', Middleware.user, UserController.getUserWhiteListIpByUserId);

// PUT /Route to update user details bu userId
router.put('/updateUserByUserId/:userId', Middleware.admin, UserController.updateUserByUserId);

// PUT /Route to update user api key for user
router.put('/updateUserApiKeyByUserId', Middleware.user, UserController.updateUserApiKeyByUserId);

// DELETE /Route to delete the user by userId
router.delete('/deleteUserByUserId/:userId', Middleware.user, UserController.deleteUserByUserId);

router.put('/updateUserWhiteListIp', Middleware.user, UserController.addUserWhiteListIp);

router.delete('/updateUserWhiteListIp', Middleware.user, UserController.removeUserWhiteListIp);

export default router;