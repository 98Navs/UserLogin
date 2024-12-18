// src/controllers/TransactionHistoryController.mjs
import TransactionHistoryRepository from "../repositories/TransactionHistoryRepository.mjs";
import { CommonHandler } from "./CommonHandler.mjs";

class TransactionHistoryController{ 
    static async getAllTransactionHistory(req, res) {
        try {
            const { status, search, startDate, endDate, pageNumber = 1, perpage = 20 } = req.query;
            const options = { page: Number(pageNumber), limit: Number(perpage) };
            const filterParams = { status, search, startDate, endDate };
            const payment = Object.keys(filterParams).length > 0 ?
                await TransactionHistoryRepository.filterTransactionHistorys(null, filterParams, options, req) :
                await TransactionHistoryRepository.getAllTransactionHistory(options, req);

            if (payment && payment.data && Array.isArray(payment.data)) {
                payment.data = payment.data.map(item => {
                    const itemData = item._doc || item;
                    const { endResult, ...cleanItem } = itemData;
                    return cleanItem;
                });
            }
            res.status(200).json({ status: 200, success: true, message: 'All payments fetched successfully',data: payment });
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
            const transactions = await TransactionHistoryRepository.getAllTransactionHistoryDataInCSV();
            const fields = ['_id', 'userName', 'createdAt', 'transactionId', 'serviceName', 'amount', 'gstCharge', 'gstNumber', 'status'];
            const csvArray = transactions.length > 0 ? [fields, ...transactions.map(transaction => fields.map(field => transaction[field]))] : [fields];
            res.status(200).json({ status: 200, success: true, message: transactions.length > 0 ? 'All transactions fetched successfully' : 'No transaction history found, returning empty data.', data: csvArray });

        } catch (error) {
            res.status(500).json({ status: 500, success: false, message: 'Failed to export transactions to desired format.' });
        }
    }

    static async getUserTransactionHistoryDataInCSV(req, res) {
        try {
            const { userId, startDate, endDate } = req.query;
            const users = await TransactionHistoryRepository.getTransactionHistoryByFilters(userId, startDate, endDate);
            const fields = ['_id', 'userName', 'createdAt', 'transactionId', 'serviceName', 'amount', 'gstCharge', 'gstNumber', 'status'];
            const csvArray = users.length > 0 ? [fields, ...users.map(user => fields.map(field => user[field]))] : [fields];
            res.status(200).json({ status: 200, success: true, message: users.length > 0 ? 'User transaction history fetched successfully' : 'No transaction history found, returning empty data.', data: csvArray });
        } catch (error) {
            res.status(500).json({ status: 500, success: false, message: 'Failed to fetch user transaction history data.' });
        }
    }


}
export default TransactionHistoryController;