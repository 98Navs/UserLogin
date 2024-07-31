import { CommonHandler, NotFoundError } from "./CommonHandler.mjs";
import DashboardRepository from '../repositories/DashboardRepository.mjs';
import VerifyController from "./VerifyController.mjs";
import WalletRepository from "../repositories/WalletRepository.mjs";

class DashboardController {
    static async getAdminApiHitCountStats(req, res) {
        try {
            const { selectDate } = req.query;
            const serviceNames = Object.keys(VerifyController.SERVICES);
            const serviceCounts = await Promise.all(serviceNames.map(service => DashboardRepository.getAdminApiHitCountStats(VerifyController.SERVICES[service], selectDate)));
            const data = serviceNames.reduce((result, service, index) => {
                result[service] = serviceCounts[index];
                return result;
            }, {});

            res.status(200).json({ status: 200, success: true, message: 'Admin API hit counts fetched successfully', data });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getUserApiHitCountStats(req, res) {
        try {
            const { selectDate } = req.query;
            const userId = req.user.userId;
            const serviceNames = Object.keys(VerifyController.SERVICES);
            const serviceCounts = await Promise.all(serviceNames.map(service => DashboardRepository.getUserApiHitCountStats(userId, VerifyController.SERVICES[service], selectDate)));
            const data = serviceNames.reduce((result, service, index) => {
                result[service] = serviceCounts[index];
                return result;
            }, {});

            res.status(200).json({ status: 200, success: true, message: 'User API hit counts fetched successfully', data });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getAdminGraphStats(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) { throw new ValidationError('Both startDate and endDate are required.'); }
            const data = await DashboardRepository.getAdminGraphStats(startDate, endDate);
            res.status(200).json({ status: 200, success: true, message: 'Graph stats fetched successfully', data });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getUserGraphStats(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const userId = req.user.userId;
            if (!startDate || !endDate) { throw new ValidationError('Both startDate and endDate are required.'); }
            const data = await DashboardRepository.getUserGraphStats(userId, startDate, endDate);
            res.status(200).json({ status: 200, success: true, message: 'Graph stats fetched successfully', data });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getWalletDetails(req, res) {
        try {
            const userId = req.user.userId;
            const userWallet = await WalletRepository.getWalletByUserId(userId);
            if (!userWallet) { throw new NotFoundError(`Wallet details not found for userId: ${userId}`); }
            res.status(200).json({ status: 200, success: true, message: 'Wallet details fetched successfully', data: userWallet });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }


}

export default DashboardController;