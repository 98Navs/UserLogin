// src/repositories/ApiPartiesRepository.mjs
import ServiceTable from '../models/ServiceTableModel.mjs';
import TransactionHistory from '../models/TransactionHistoryModel.mjs';
import { paginate } from '../project_setup/Utils.mjs';
//serviceTable
class TransactionHistoryRepository {
    static async createTransactionHistory(transactionHistoryData) { return await TransactionHistory.create(transactionHistoryData); }

    static async getTransactionHistoryById(id) { return await TransactionHistory.findById(id) };

    static async updateTransactionHistoryById(id, transactionHistoryData) { return await TransactionHistory.findByIdAndUpdate(id, transactionHistoryData, { new: true }); }


}

export default TransactionHistoryRepository;