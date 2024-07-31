import { CommonHandler } from "./CommonHandler.mjs";
import DashboardRepository from '../repositories/DashboardRepository.mjs';
import VerifyController from "./VerifyController.mjs";

class DashboardController {
    static async getAdminApiHitCountStats(req, res) {
        try {
            const { selectDate } = req.query;
            const serviceNames = Object.keys(VerifyController.SERVICES);
            const serviceCounts = await Promise.all(serviceNames.map(service => DashboardRepository.getAdminApiHitCountStatsByServiceName(VerifyController.SERVICES[service], selectDate)));
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
            const serviceCounts = await Promise.all(serviceNames.map(service => DashboardRepository.getUserApiHitCountStatsByServiceName(userId, VerifyController.SERVICES[service], selectDate)));
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


}

export default DashboardController;