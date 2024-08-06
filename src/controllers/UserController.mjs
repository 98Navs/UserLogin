// src/controllers/UserController.mjs
import dayjs from 'dayjs';
import UserRepository from '../repositories/UserRepository.mjs';
import PackageSetupRepository from '../repositories/PackageSetupRepository.mjs';
import UserLoginLogsRepository from '../repositories/UserLoginLogsRepository.mjs'
import { CommonHandler, ValidationError, NotFoundError } from './CommonHandler.mjs';
import UserRegistrationController from './UserRegistrationController.mjs';

class UserController {
    static async userRechargeByAdmin(req, res) {
        try {
            const { email, amount } = req.body;

            if (typeof email !== 'string') { throw new ValidationError('Email must be of string format'); }
            if (typeof amount !== 'number') { throw new ValidationError('Amount must be of number format'); }
            await CommonHandler.validateEmailFormat(email);

            const [user, admin] = await Promise.all([UserRepository.getUserByEmail(email), UserRepository.getUserByEmail('admin@scriza.in')]);
            if (!user) { throw new NotFoundError(`User not found with email: ${email}`); }
            if (!admin) { throw new NotFoundError(`Admin not found with email: admin@scriza.in`); }

            if (admin.amount < amount) { throw new ValidationError(`Admin doesn't have sufficient funds. Current balance: ${admin.amount}`); }
            user.amount += amount;
            admin.amount -= amount;
            await Promise.all([user.save(), admin.save()]);

            res.status(201).json({ status: 201, success: true, message: `User recharged successfully by admin to ${user.userName} for amount: ${amount}` });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getAllUsers(req, res) {
        try {
            const { search, startDate, endDate, pageNumber = 1, perpage = 10 } = req.query;
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