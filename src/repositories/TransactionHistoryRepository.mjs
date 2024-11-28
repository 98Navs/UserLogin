// src/repositories/TransactionHistoryRepository.mjs
import TransactionHistory from '../models/TransactionHistoryModel.mjs';
import { paginate } from "../project_setup/Utils.mjs";

class TransactionHistoryRepository {
    static sort = { createdAt: -1 };

    static async createTransactionHistory(transactionHistoryData) { return await TransactionHistory.create(transactionHistoryData); }

    static async getAllTransactionHistory(options, req) { return await paginate(TransactionHistory, {}, options.page, options.limit, req); }

    static async getAllTransactionHistoryforUser(userId, options, req) { return paginate(TransactionHistory, { userId }, options.page, options.limit, req); }

    static async getTransactionHistoryById(id) { return await TransactionHistory.findById(id); }

    static async getAllTransactionHistoryDataInCSV() { return await TransactionHistory.find().sort(this.sort).lean().exec(); }

    static async getUserTransactionHistoryDataInCSV(userId) { return await TransactionHistory.find({ userId }).sort(this.sort).lean().exec(); }

    static async updateTransactionHistoryById(id, transactionHistoryData) { return await TransactionHistory.findByIdAndUpdate(id, transactionHistoryData, { new: true }); }

    static async getTransactionHistoryByFilters(userId = null, startDate = null, endDate = null) {
        const query = {};
        if (userId) query.userId = userId; 
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
        }
        return await TransactionHistory.find(query).sort(this.sort).lean().exec();
    }


    static async filterTransactionHistorys(userId = null, filterParams, options, req) {
        const query = {};
        if (userId) { query.userId = userId; }
        if (filterParams.status) { query.status = new RegExp(`^${filterParams.status}`, 'i'); }
        if (filterParams.search) {
            const searchRegex = new RegExp(`^${filterParams.search}`, 'i');
            query.$or = [
                { $expr: { $regexMatch: { input: { $toString: "$userId" }, regex: searchRegex } } },
                { userName: searchRegex },
                { transactionId: searchRegex },
                { serviceName : searchRegex }
            ];
        }
        if (filterParams.startDate || filterParams.endDate) {
            query.createdAt = {};
            if (filterParams.startDate) query.createdAt.$gte = new Date(filterParams.startDate);
            if (filterParams.endDate) { query.createdAt.$lte = new Date(new Date(filterParams.endDate).setHours(23, 59, 59, 999)); }
        }
        return await paginate(TransactionHistory, query, options.page, options.limit, req);
    }
}
export default TransactionHistoryRepository;