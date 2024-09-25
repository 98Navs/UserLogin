// src/controllers/UserController.mjs
import dayjs from 'dayjs';
import crypto from 'crypto';
import UserRepository from '../repositories/UserRepository.mjs';
import PackageSetupRepository from '../repositories/PackageSetupRepository.mjs';
import UserLoginLogsRepository from '../repositories/UserLoginLogsRepository.mjs'
import { CommonHandler, ValidationError, NotFoundError } from './CommonHandler.mjs';
import UserRegistrationController from './UserRegistrationController.mjs';

class UserController {
    static async getAllUsers(req, res) {
        try {
            const { search, startDate, endDate, pageNumber = 1, perpage = null } = req.query;
            const options = { page: Number(pageNumber), limit: Number(perpage) };
            const filterParams = { search, startDate, endDate };
            const users = Object.keys(filterParams).length > 0 ?
                await UserRepository.filterUsers(filterParams, options, req) :
                await UserRepository.getAllUsers(options, req);
            res.status(200).json({ status: 200, success: true, message: 'Users fetched successfully', data: users });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getUserByUserId(req, res) {
        try {
            const { userId } = req.params;
            const user = await UserRegistrationController.validateAndFetchUserByUserId(userId);
            res.status(200).json({ status: 200, success: true, message: `Data fetched successfully for userId ${userId}`, data: user });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getUserDetails(req, res) {
        try {
            const userId = req.user.userId;
            const user = await UserRegistrationController.validateAndFetchUserByUserId(userId);
            res.status(200).json({ status: 200, success: true, message: `Data fetched successfully for userId ${userId}`, data: user });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getUserLoginLogs(req, res) {
        try {
            const userId = req.user.userId;
            const { pageNumber = 1, perpage = 10 } = req.query;
            const options = { page: Number(pageNumber), limit: Number(perpage) }; 
            const loginLogs = await UserLoginLogsRepository.getUserLoginLogsByUserId(userId, options, req);
            res.status(200).json({ status: 200, success: true, message: 'User login logs fetched successfully', data: loginLogs });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getUserApiKeyByUserId(req, res) {
        try {
            const userId = req.user.userId;
            const user = await UserRegistrationController.validateAndFetchUserByUserId(userId);
            res.status(200).json({ status: 200, success: true, message: 'User api key fetched successfully', data: user.apiKey });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getUserWhiteListIpByUserId(req, res) {
        try {
            const userId = req.user.userId;
            const user = await UserRegistrationController.validateAndFetchUserByUserId(userId);
            const whiteListIp = user.whiteListIp.map(ip => ({ whiteListIp: ip }));
            res.status(200).json({ status: 200, success: true, message: 'User white list ip fetched successfully', data: whiteListIp });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getUserServicesByUserId(req, res) {
        try {
            const { userId } = req.query;
            const userData = await UserRegistrationController.validateAndFetchUserByUserId(userId);
            const activeServices = userData.packageDetails.filter(service => service.status === 'Active').map(service => ({ activeServices: service.serviceType}));
            return res.status(200).json({ status: 200, success: true, message: `User service types fetched successfully`, data: activeServices });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async deleteAlluser(req, res) {
        try {
            const allUserDeleted = await UserRepository.deleteAllUsers();
            res.status(200).json({ status: 200, success: true, message: 'All users data deleted successfully', data: allUserDeleted });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async addUserWhiteListIp(req, res) {
        try {
            const userId = req.user.userId;
            const { whiteListIp } = req.query;
            const user = await UserRegistrationController.validateAndFetchUserByUserId(userId);
            if (user.whiteListIp.includes(whiteListIp)) { throw new ValidationError(`Entered whiteListIp: ${whiteListIp} already exist`); }
            user.whiteListIp.unshift(whiteListIp);
            await user.save();
            res.status(200).json({ status: 200, success: true, message: `White List IP :${whiteListIp} address added successfully.`, data: user.whiteListIp });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async removeUserWhiteListIp(req, res) {
        try {
            const userId = req.user.userId;
            const { whiteListIp } = req.query;
            const user = await UserRegistrationController.validateAndFetchUserByUserId(userId);
            user.whiteListIp = user.whiteListIp.filter(ip => ip !== whiteListIp);
            await user.save();
            res.status(200).json({ status: 200, success: true, message: `White List IP :${whiteListIp} address removed successfully.`, data: user.whiteListIp });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async updateUserByUserId(req, res) {
        try {
            const { userId } = req.params;
            await UserRegistrationController.validateAndFetchUserByUserId(userId);
            const userData = await UserController.validateAndUpdateUserFields(req.body);
            const updatedUser = await UserRepository.updateUserByUserId(userId, userData);
            res.status(200).json({ status: 200, success: true, message: `User with userId ${userId} updated successfully.`, data: updatedUser });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async updateUserApiKeyByUserId(req, res) {
        try {
            const userId = req.user.userId
            await UserRegistrationController.validateAndFetchUserByUserId(userId);
            const newDefaultApiKey = crypto.randomBytes(25).toString('hex');
            const updatedUserApiKey = await UserRepository.updateUserApiKey(userId, { apiKey: newDefaultApiKey} );
            res.status(200).json({ status: 200, success: true, message: 'User Api Key updated successful!', data: { newApiKey: updatedUserApiKey.apiKey } });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async deleteUserByUserId(req, res) {
        try {
            const { userId } = req.params;
            await UserRegistrationController.validateAndFetchUserByUserId(userId);
            const deleteUser = await UserRepository.deleteUserByUserId(userId);
            res.status(200).json({ status: 200, success: true, message: `Data deleted successfully for userId ${userId}`, data: deleteUser });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    // Static Methods Only For This Class (Not To Be Used In Routes)
    static async validateAndUpdateUserFields(data) {
        const { password, packageName, serviceType, role, status } = data;

        if (role) { await CommonHandler.validateRole(role); }
        if (status) { await CommonHandler.validateStatus(status); }
        if (password) {
            await CommonHandler.validatePasswordFormat(password);
            data.password = await CommonHandler.hashPassword(password);
        }
        if (packageName) {
            const packageSetup = await PackageSetupRepository.getPackageSetupByPackageName(packageName);
            if (!packageSetup) { throw new NotFoundError(`No package found by entered name: ${packageName}`); }
            const today = dayjs();
            const allServicesActive = serviceType && serviceType.includes('ALL');
            const packageDetails = JSON.parse(JSON.stringify(packageSetup.servicesProvided));
            data.packageDetails = packageDetails.map(service => {
                const expirationDate = today.add(service.serviceLifeSpan, 'day').format('YYYY-MM-DD');
                const isServiceTypeIncluded = allServicesActive || (serviceType && serviceType.includes(service.serviceType));
                return { ...service, serviceLifeEnds: expirationDate, status: isServiceTypeIncluded ? 'Active' : 'InActive' };
            });
        }
        return data;
    }
}
export default UserController;