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

// POST /Route for admin to rechrge user wallet
router.post('/userRechargeByAdmin', Middleware.admin, UserController.userRechargeByAdmin);

// GET /Route to get all users
router.get('/getAllUsers', Middleware.admin, UserController.getAllUsers);

// GET /Route to get user details by userId
router.get('/getUserByUserId/:userId', Middleware.admin, UserController.getUserByUserId);

// PUT /Route to update user details bu userId
router.put('/updateUserByUserId/:userId', Middleware.user, UserController.updateUserByUserId);

// DELETE /Route to delete the user by userId
router.delete('/deleteUserByUserId/:userId', Middleware.user, UserController.deleteUserByUserId);

export default router;