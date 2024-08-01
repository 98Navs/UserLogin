// src/routes/BankDetailsRoutes.mjs
import express from 'express';
import Middleware from '../project_setup/Middleware.mjs'
import UserApiKeyController from '../controllers/UserApiKeyController.mjs';

const router = express.Router();

// PUT /Route to update user api key for user
router.put('/updateUserApiKey', Middleware.user, UserApiKeyController.updateUserApiKey);

export default router;