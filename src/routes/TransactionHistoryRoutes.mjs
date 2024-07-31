// src/routes/BankDetailsRoutes.mjs
import express from 'express';
import Middleware from '../project_setup/Middleware.mjs'
import TransactionHistoryController from '../controllers/TransactionHistoryController.mjs';

const router = express.Router();

router.get('/getAllTransactionHistory', Middleware.admin, TransactionHistoryController.getAllTransactionHistory);

router.get('/getAllTransactionHistoryforUser', Middleware.user, TransactionHistoryController.getAllTransactionHistoryforUser);

router.get('/getAllTransactionHistoryDataInCSV', Middleware.admin, TransactionHistoryController.getAllTransactionHistoryDataInCSV);

router.get('/getUserTransactionHistoryDataInCSV', Middleware.user, TransactionHistoryController.getUserTransactionHistoryDataInCSV);

export default router;