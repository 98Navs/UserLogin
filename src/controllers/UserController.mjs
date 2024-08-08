// src/controllers/UserController.mjs
import dayjs from 'dayjs';
import axios from 'axios';
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

    static async getAllAvailablePackageSetupNames(req, res) {
        try {
            const availablePackages = await PackageSetupRepository.getAllAvailablePackageSetupNames();
            if (!availablePackages) { throw new NotFoundError('No packages found' ); }
            const packageNames = availablePackages.map(pkg => ({ packageName: pkg.packageName }));
            res.status(200).json({ status: 200, success: true, message: 'Package names fetched successfully', data: packageNames });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getAllAvailableServiceTypeByPackageName(req, res) {
        try {
            const { packageName } = req.query;
            const availableServices = await PackageSetupRepository.getPackageSetupByPackageName(packageName);
            if (!availableServices) { throw new NotFoundError(`Package not found with package name: ${packageName}`); }
            const serviceTypes = availableServices.servicesProvided.map(service => ({ serviceType: service.serviceType }));
            res.status(200).json({ status: 200, success: true, message: 'Service types fetched successfully', data: serviceTypes });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getAreaDetailsByPinCode(req, res) {
        try {
            const { pinCode } = req.query;
            await CommonHandler.validateRequiredFields({ pinCode });
            await CommonHandler.validatePinCodeFormat(pinCode);

            const { data } = await axios.get(`https://api.postalpincode.in/pincode/${pinCode}`);
            if (data?.[0]?.Status === "Success") {
                const postOffices = data[0].PostOffice;
                if (postOffices.length > 0) {
                    const { Country: country, State: state, District: district } = postOffices[0];
                    const areaNames = postOffices.map(po => ({ areaName: po.Name }));
                    return res.status(200).json({ status: 200, success: true, message: `Area details for pin code ${pinCode} fetched successfully`, data: { country, state, district, areaNames } });
                }
            }
            throw new NotFoundError(`No data found for pin code ${pinCode}`);
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

    static async updateUserApiKey(req, res) {
        try {
            const userId = req.user.userId;
            const updateUserApiKey = await UserRepository.updateUserApiKey(userId, req.body);
            res.status(200).json({ status: 200, success: true, message: 'User Api Key updated successful!', data: updateUserApiKey });
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
        const { password, packageName, role, status } = data;

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
            data.packageDetails = packageSetup.servicesProvided.map(service => {
                const expirationDate = today.add(service.serviceLifeSpan, 'day').format('YYYY-MM-DD');
                return { ...service.toObject ? service.toObject() : service, serviceLifeEnds: expirationDate }; });
        }
        return data;
    }
}
export default UserController;