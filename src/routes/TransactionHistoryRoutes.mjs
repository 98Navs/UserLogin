// src/routes/BankDetailsRoutes.mjs
import express from 'express';
import Middleware from '../project_setup/Middleware.mjs'
import TransactionHistoryController from '../controllers/TransactionHistoryController.mjs';

const router = express.Router();

// GET /Route to get all transaction history
router.get('/getAllTransactionHistory', Middleware.admin, TransactionHistoryController.getAllTransactionHistory);

// GET /Route to get all transaction history for user
router.get('/getAllTransactionHistoryforUser', Middleware.user, TransactionHistoryController.getAllTransactionHistoryforUser);

// GET /Route to get all transaction history data in CSV
router.get('/getAllTransactionHistoryDataInCSV', Middleware.admin, TransactionHistoryController.getAllTransactionHistoryDataInCSV);

// GET /Route to get all transaction history data in CSV for user by admin
router.get('/getUserTransactionHistoryDataInCSVByUserId/:userId', Middleware.admin, TransactionHistoryController.getUserTransactionHistoryDataInCSVByUserId)

// GET /Route to get all transaction history data in CSV for user
router.get('/getUserTransactionHistoryDataInCSV', Middleware.user, TransactionHistoryController.getUserTransactionHistoryDataInCSV);

export default router;