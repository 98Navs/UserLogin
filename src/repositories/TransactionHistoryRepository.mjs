// src/repositories/TransactionHistoryRepository.mjs
import TransactionHistory from '../models/TransactionHistoryModel.mjs';

//serviceTable
class TransactionHistoryRepository {
    static async createTransactionHistory(transactionHistoryData) { return await TransactionHistory.create(transactionHistoryData); }

    static async getTransactionHistoryById(id) { return await TransactionHistory.findById(id) };

    static async updateTransactionHistoryById(id, transactionHistoryData) { return await TransactionHistory.findByIdAndUpdate(id, transactionHistoryData, { new: true }); }


}

export default TransactionHistoryRepository;