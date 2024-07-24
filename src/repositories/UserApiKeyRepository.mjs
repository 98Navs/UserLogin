// src/repositories/ApiPartiesRepository.mjs
import UserApikey from '../models/UserApiKeyModel.mjs';
//serviceTable
class UserApikeyRepository {
    static async createUserApikey(userApikeyData) { return await UserApikey.create(userApikeyData); }

    static async getUserApiKeyByApiKey(apiKey) { return await UserApikey.findOne({ apiKey }); }

    static async updateTransactionHistoryById(id, transactionHistoryData) { return await UserApikey.findByIdAndUpdate(id, transactionHistoryData, { new: true }); }

    static async deleteUserApiKeyByUserId(userId) { return await UserApikey.findOneAndDelete({ userId }); }


}

export default UserApikeyRepository;