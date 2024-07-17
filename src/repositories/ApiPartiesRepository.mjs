// src/repositories/ApiPartiesRepository.mjs
import ApiParties from '../models/ApiPartiesModel.mjs';
import { paginate } from '../project_setup/Utils.mjs';
//apiParties
class ApiPartiesRepository {
    static async createApiParty(apiPartiesData) { return await ApiParties.create(apiPartiesData); }

    static async getAllApiPartiess(options, req) { return await paginate(ApiParties, {}, options.page, options.limit, req); }

    static async getApiPartyByOperationName(operationName) { return await ApiParties.findOne({ operationName: new RegExp(`^${operationName}`, 'i') }); }

    static async getCurrentPrimaryApiOperator(operationName) { return await ApiParties.findOne({ operationName, primary: 'Yes' }); }


    // static async getWalletByUserId(userId) { return await ApiParties.findOne({ userId }); }

    // static async getWalletsByUserIds(userIds) { return await ApiParties.find({ userId: { $in: userIds } }); }


    // static async filterUsers(filterParams, options, req) {
    //     const query = {};

    //     if (filterParams.search) {
    //         const searchRegex = new RegExp(`^${filterParams.search}`, 'i');
    //         query.$or = [
    //             { $expr: { $regexMatch: { input: { $toString: "$userId" }, regex: searchRegex } } }
    //         ];
    //     }
    //     if (filterParams.startDate || filterParams.endDate) {
    //         query.createdAt = {};
    //         if (filterParams.startDate) query.createdAt.$gte = new Date(filterParams.startDate);
    //         if (filterParams.endDate) { query.createdAt.$lte = new Date(new Date(filterParams.endDate).setHours(23, 59, 59, 999)); }
    //     }
    //     return await paginate(ApiParties, query, options.page, options.limit, req);
    // }
}

export default ApiPartiesRepository;