// src/routes/BankDetailsRoutes.mjs
import express from 'express';
import Middleware from '../project_setup/Middleware.mjs'
import BankDetailsController from '../controllers/BankDetailsController.mjs';

const router = express.Router();

// POST /Route to create a new user bank details
router.post('/createBankDetails', Middleware.user, BankDetailsController.createBankDetails);

// GET /Route to get all admin bank details
router.get('/getAdminBankDetails', Middleware.user, BankDetailsController.getAdminBankDetails);

// GET /Route to get all admin banks saveAs
router.get('/getAdminSaveAs', Middleware.user, BankDetailsController.getAdminSaveAs);

// GET /Route to get bank details by bankId
router.get('/getBankDetailsByBankId/:bankId', Middleware.user, BankDetailsController.getBankDetailsByBankId)

// GET /Route to get all user bank details by userId
router.get('/getUserBankDetailsByUserId/:userId', Middleware.user, BankDetailsController.getUserBankDetailsByUserId);

// GET /Route to get all user banks details by userId and saveAs
router.get('/getBankDetailsByUserIdAndSaveAs/:userId/:saveAs', Middleware.user, BankDetailsController.getBankDetailsByUserIdAndSaveAs);

// PUT /Route to update a primary account by bankId
router.put('/updatePrimaryAccountByBankId/:bankId', Middleware.user, BankDetailsController.updatePrimaryAccountByBankId);

// PUT /Route to update a bank details by userId and saveAs
router.put('/updateBankDetailsByBankId/:bankId', Middleware.user, BankDetailsController.updateBankDetailsByBankId);

// DELETE /Route to delete a specific bank details by bankId
router.delete('/deleteBankDetailsByBankId/:bankId', Middleware.user, BankDetailsController.deleteBankDetailsByBankId);

export default router;