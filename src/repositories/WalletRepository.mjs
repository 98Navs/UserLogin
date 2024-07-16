// src/repositories/WalletRepository.mjs
import Wallet from '../models/WalletModel.mjs';
import { paginate } from '../project_setup/Utils.mjs';

class WalletRepository {
    static async createWallet(walletData) { return await Wallet.create(walletData); }

    static async getAllWallets(options, req) { return await paginate(Wallet, {}, options.page, options.limit, req); }

    static async getWalletByUserId(userId) { return await Wallet.findOne({ userId }); }

    static async getWalletsByUserIds(userIds) { return await Wallet.find({ userId: { $in: userIds } }); }


    static async filterUsers(filterParams, options, req) {
        const query = {};

        if (filterParams.search) {
            const searchRegex = new RegExp(`^${filterParams.search}`, 'i');
            query.$or = [
                { $expr: { $regexMatch: { input: { $toString: "$userId" }, regex: searchRegex } } }
            ];
        }
        if (filterParams.startDate || filterParams.endDate) {
            query.createdAt = {};
            if (filterParams.startDate) query.createdAt.$gte = new Date(filterParams.startDate);
            if (filterParams.endDate) { query.createdAt.$lte = new Date(new Date(filterParams.endDate).setHours(23, 59, 59, 999)); }
        }
        return await paginate(Wallet, query, options.page, options.limit, req);
    }
}

export default WalletRepository;