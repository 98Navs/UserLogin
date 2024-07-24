//src/routes/UserRoutes.mjs
import express from 'express';
import UserController from '../controllers/UserController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to create a new user
router.post('/createUser', UserController.createUser);

// POST /Route for user to signIn
router.post('/signIn', UserController.signIn);

// POST /Route for user to signOut
router.post('/signOut', Middleware.user, UserController.signOut);

// POST /Route for admin to rechrge user wallet
router.post('/userRechargeByAdmin', Middleware.admin, UserController.userRechargeByAdmin);

// GET /Route to get all users
router.get('/getAllUsers', Middleware.admin, UserController.getAllUsers);

// GET /Route to get user details by userId
router.get('/getUserByUserId/:userId', Middleware.user, UserController.getUserByUserId);

router.delete('/deleteUserByUserId/:userId', UserController.deleteUserByUserId);

export default router;