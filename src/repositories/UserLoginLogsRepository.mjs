// src/repositories/UserLoginLogsRepository.mjs
import UserLoginLogs from "../models/UserLoginLogsModel.mjs";
import { paginate } from "../project_setup/Utils.mjs";

class UserLoginLogsRepository {
    static async createUserLoginLogs(userLoginLogsData) { return await UserLoginLogs.create(userLoginLogsData); }

    static async getUserLoginLogsByUserId(userId, options, req) { return paginate(UserLoginLogs, { userId }, options.page, options.limit, req); }

    static async getUserLogTokenByUserIdAndToken({ userId, token }) { return await UserLoginLogs.findOne({ userId, token }); }

    static async blockUserLogTokenByUserIdAndToken({ userId, token }) { return await UserLoginLogs.findOneAndUpdate({ userId, token }, { status: 'TERMINATED' }, { new: true }); }

    static async updateUserLogTokenByUserIdAndToken({ userId, token }) { return await UserLoginLogs.findOneAndUpdate({ userId, token }, { updatedAt: Date.now }, { new: true }); }
}
export default UserLoginLogsRepository;