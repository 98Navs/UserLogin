import { Parser } from 'json2csv';
import TransactionHistoryRepository from "../repositories/TransactionHistoryRepository.mjs";
import { CommonHandler, ValidationError } from "./CommonHandler.mjs";

class TransactionHistoryController{ 
   
    static async getAllTransactionHistory(req, res) {
        try {
            const { status, search, startDate, endDate, pageNumber = 1, perpage = 10 } = req.query;
            const options = { page: Number(pageNumber), limit: Number(perpage) };
            const filterParams = { status, search, startDate, endDate };
            const payment = Object.keys(filterParams).length > 0 ?
                await TransactionHistoryRepository.filterTransactionHistorys( null, filterParams, options, req) :
                await TransactionHistoryRepository.getAllTransactionHistory(options, req);
            res.status(200).json({ status: 200, success: true, message: 'All payments fetched successfully', data: payment });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getAllTransactionHistoryforUser(req, res) {
        try {
            const userId = req.user.userId;
            const { status, search, startDate, endDate, pageNumber = 1, perpage = 10 } = req.query;
            const options = { page: Number(pageNumber), limit: Number(perpage) };
            const filterParams = { status, search, startDate, endDate };
            const payment = Object.keys(filterParams).length > 0 ?
                await TransactionHistoryRepository.filterTransactionHistorys(userId, filterParams, options, req) :
                await TransactionHistoryRepository.getAllTransactionHistoryforUser(userId, options, req);
            res.status(200).json({ status: 200, success: true, message: 'All payments fetched successfully', data: payment });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getAllTransactionHistoryDataInCSV(req, res) {
        try {
            const users = await TransactionHistoryRepository.getAllTransactionHistoryDataInCSV();
            const fields = ['_id', 'userName', 'createdAt', 'transactionId', 'serviceName', 'amount', 'gstNumber', 'status'];
            const csv = new Parser({ fields }).parse(users);
            res.status(200).header('Content-Type', 'text/csv').header('X-Status', '200').header('X-Success', 'true').header('X-Message', 'All payments fetched successfully').attachment('users.csv').send(csv);
        } catch (error) {
            res.status(500).json({ status: 500, success: false, message: 'Failed to export users to CSV.' });
        }
    }

    static async getUserTransactionHistoryDataInCSV(req, res) {
        try {
            const userId = req.user.userId;
            const users = await TransactionHistoryRepository.getUserTransactionHistoryDataInCSV(userId);
            const fields = ['_id', 'userName', 'createdAt', 'transactionId', 'serviceName', 'amount', 'gstNumber', 'status'];
            const csv = new Parser({ fields }).parse(users);
            res.status(200).header('Content-Type', 'text/csv').header('X-Status', '200').header('X-Success', 'true').header('X-Message', 'All payments fetched successfully').attachment('users.csv').send(csv);
        } catch (error) {
            res.status(500).json({ status: 500, success: false, message: 'Failed to export users to CSV.' });
        }
    }
}

export default TransactionHistoryController;