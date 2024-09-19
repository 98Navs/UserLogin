// src/controllers/DashboardController.mjs
import { CommonHandler, NotFoundError } from "./CommonHandler.mjs";
import DashboardRepository from '../repositories/DashboardRepository.mjs';
import VerifyController from "./VerifyController.mjs";
import UserRepository from "../repositories/UserRepository.mjs";

class DashboardController {
    static async getAdminApiHitCountStats(req, res) {
        try {
            const { selectDate } = req.query;
            const services = await Promise.all(Object.values(VerifyController.SERVICES).map(async service => ({ serviceName: service, ...(await DashboardRepository.getAdminApiHitCountStats( service, selectDate)) })));
            res.status(200).json({ status: 200, success: true, message: 'Admin API hit counts fetched successfully', data: services });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getUserApiHitCountStats(req, res) {
        try {
            const { selectDate } = req.query;
            const userId = req.user.userId;
            const services = await Promise.all( Object.values(VerifyController.SERVICES).map(async service => ({ serviceName: service, ...(await DashboardRepository.getUserApiHitCountStats(userId, service, selectDate)) })) );
            res.status(200).json({ status: 200,success: true, message: 'User API hit counts fetched successfully', data: services });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getAdminGraphStats(req, res) {
        try {
            const { startDate, endDate } = req.query;
            await CommonHandler.validateRequiredFields({ startDate, endDate });
            const data = await DashboardRepository.getAdminGraphStats(startDate, endDate);
            res.status(200).json({ status: 200, success: true, message: 'Graph admin stats fetched successfully', data });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getUserGraphStats(req, res) {
        try {
            const userId = req.user.userId;
            const { startDate, endDate } = req.query;
            await CommonHandler.validateRequiredFields({ startDate, endDate });
            const data = await DashboardRepository.getUserGraphStats(userId, startDate, endDate);
            res.status(200).json({ status: 200, success: true, message: `Graph user stats with userId: ${userId} fetched successfully`, data });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getWalletDetails(req, res) {
        try {
            const userId = req.user.userId;
            const user = await UserRepository.getUserByUserId(userId);
            if (!user) { throw new NotFoundError(`User details not found for userId: ${userId}`); }
            res.status(200).json({ status: 200, success: true, message: 'Wallet details fetched successfully', data: user.amount });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }
}
export default DashboardController;