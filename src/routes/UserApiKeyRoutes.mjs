// src/routes/BankDetailsRoutes.mjs
import express from 'express';
import Middleware from '../project_setup/Middleware.mjs'
import UserApiKeyController from '../controllers/UserApiKeyController.mjs';

const router = express.Router();

router.put('/updateUserApiKey', Middleware.user, UserApiKeyController.updateUserApiKey);


export default router;