// src/repositories/UserApikeyRepository.mjs
import UserApikey from '../models/UserApiKeyModel.mjs';

class UserApikeyRepository {
    static async createUserApikey(userApikeyData) { return await UserApikey.create(userApikeyData); }

    static async getUserApiKeyByApiKey(apiKey) { return await UserApikey.findOne({ apiKey }); }

    static async getUserApiKeyByUserId(userId) { return await UserApikey.findOne({ userId }); }

    static async updateUserApiKey(userId, userApiKeyData) { return await UserApikey.findOneAndUpdate({ userId }, userApiKeyData, { new: true }); }

    static async deleteUserApiKeyByUserId(userId) { return await UserApikey.findOneAndDelete({ userId }); }
}

export default UserApikeyRepository;