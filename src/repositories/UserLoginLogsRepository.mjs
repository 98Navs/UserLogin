// src/repositories/UserLoginLogsRepository.mjs
import UserLoginLogs from "../models/UserLoginLogsModel.mjs";
import { paginate } from "../project_setup/Utils.mjs";

class UserLoginLogsRepository{ 
    static async createUserLoginLogs(userLoginLogsData) { return await UserLoginLogs.create(userLoginLogsData); }

    static async getUserLoginLogsByUserId(userId, options, req) { return paginate(UserLoginLogs, { userId }, options.page, options.limit, req); }
}
export default UserLoginLogsRepository;