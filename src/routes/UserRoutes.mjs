//src/routes/UserRoutes.mjs
import express from 'express';
import UserController from '../controllers/UserController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to create a new user
router.post('/createUser', UserController.createUser);

// POST /Route for user to signIn
router.post('/signIn', UserController.signIn);

// POST /Route for user to apply for forgetPassword
router.post('/forgetPassword', UserController.forgetPassword);

// POST /Route for user confirm otp
router.post('/otp', UserController.otp);

// POST /Route for user to changePassword
router.post('/changePassword', UserController.changePassword);

// GET /Route to get all users
router.get('/getAllUsers', Middleware.admin, UserController.getAllUsers);

export default router;