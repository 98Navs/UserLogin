// src/repositories/UserRepository.mjs
import User from '../models/UserModel.mjs';
import { paginate } from '../project_setup/Utils.mjs';

class UserRepository {
    static async createUser(userData) { return await User.create(userData); }

    static async getAllUsers(options, req) { return await paginate(User, { role: 'user' }, options.page, options.limit, req); }
    
    static async getUserByEmail(email) { return await User.findOne({ email: new RegExp(`^${email}`, 'i') }); }

    static async getUserByMobile(mobile) { return await User.findOne({ mobile }); }

    static async getUserByUserId(userId) { return await User.findOne({ userId }); }

    static async updateUserByUserId(userId, userData) { return await User.findOneAndUpdate({ userId }, userData, { new: true }); }

    static async deleteUserByUserId(userId) { return await User.findOneAndDelete({ userId }); }

    static async createUserApikey(userApikeyData) { return await User.create(userApikeyData); }

    static async getUserApiKeyByApiKey(apiKey) { return await User.findOne({ apiKey }); }

    static async getUserApiKeyByUserId(userId) { return await User.findOne({ userId }); }

    static async updateUserApiKey(userId, userApiKeyData) { return await User.findOneAndUpdate({ userId }, userApiKeyData, { new: true }); }

    static async deleteUserApiKeyByUserId(userId) { return await User.findOneAndDelete({ userId }); }

    static async filterUsers(filterParams, options, req) {
        const query = { role: 'user' };

        if (filterParams.search) {
            const searchRegex = new RegExp(`^${filterParams.search}`, 'i');
            query.$or = [
                { $expr: { $regexMatch: { input: { $toString: "$userId" }, regex: searchRegex } } },
                { $expr: { $regexMatch: { input: { $toString: "$mobile" }, regex: searchRegex } } },
                { email: searchRegex }
            ];
        }
        if (filterParams.startDate || filterParams.endDate) {
            query.createdAt = {};
            if (filterParams.startDate) query.createdAt.$gte = new Date(filterParams.startDate);
            if (filterParams.endDate) { query.createdAt.$lte = new Date(new Date(filterParams.endDate).setHours(23, 59, 59, 999)); }
        }
        return await paginate(User, query, options.page, options.limit, req);
    }
}
export default UserRepository;