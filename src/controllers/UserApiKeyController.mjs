// src/controllers/UserApiKeyController.mjs
import UserApikeyRepository from "../repositories/UserApiKeyRepository.mjs";
import { CommonHandler } from "./CommonHandler.mjs";

class UserApiKeyController{
    static async updateUserApiKey(req, res) {
        try {
            const userId = req.user.userId;
            const updateUserApiKey = await UserApikeyRepository.updateUserApiKey(userId, req.body);
            res.status(200).json({ status: 200, success: true, message: 'User Api Key updated successful!', data: updateUserApiKey });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }
}
export default UserApiKeyController;