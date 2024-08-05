// src/controllers/UserRegistrationController.mjs
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/UserRepository.mjs';
import WalletRepository from '../repositories/WalletRepository.mjs';
import UserApikeyRepository from '../repositories/UserApiKeyRepository.mjs';
import PackageSetupRepository from '../repositories/PackageSetupRepository.mjs';
import UserLoginLogsRepository from '../repositories/UserLoginLogsRepository.mjs';
import { CommonHandler, ValidationError, NotFoundError } from './CommonHandler.mjs';
import { sendEmail } from '../project_setup/Utils.mjs';
import Middleware from '../project_setup/Middleware.mjs';

class UserRegistrationController{
    static async createUser(req, res) {
        try {
            const userData = await UserRegistrationController.validateUserData(req.body);
            const user = await UserRepository.createUser(userData);
            const wallet = await WalletRepository.createWallet({ userId: user.userId });
            const apiKey = await UserApikeyRepository.createUserApikey({ userId: user.userId });
            res.status(201).json({ status: 201, success: true, message: 'User created successfully', user, wallet, apiKey });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async signIn(req, res) {
        try {
            const { user, password, ipAddress, deviceName, location } = req.body;
            await CommonHandler.validateRequiredFields({ user, password });
            const existingUser = await UserRegistrationController.getUser(user.trim());
            if (!existingUser) { throw new NotFoundError("user not found for the provided details"); }
            if (existingUser.status != 'Active') { throw new ValidationError('User account has been deleted or suspended'); }
            if (! await bcrypt.compare(password, existingUser.password)) { throw new ValidationError('Invalid credentials.'); }
            const token = await Middleware.generateToken({ userId: existingUser.userId, email: existingUser.email, role: existingUser.role }, res);
            const loginLog = await UserLoginLogsRepository.createUserLoginLogs({ userId: existingUser.userId, ipAddress: ipAddress, deviceName: deviceName, location: location });
            res.status(200).json({ status: 200, success: true, message: 'Sign in successful!', user: { userId: existingUser.userId, email: existingUser.email, token }, loginLog });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async signOut(req, res) {
        try {
            res.clearCookie('jwt');
            res.status(200).json({ status: 200, success: true, message: 'User sign out is successful!' });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async forgetPassword(req, res) {
        try {
            const { email } = req.body;
            await CommonHandler.validateRequiredFields({ email });
            await CommonHandler.validateEmailFormat(email.trim());
            const user = await UserRepository.getUserByEmail(email.trim());
            if (!user) throw new NotFoundError('User not found.');
            const otp = Math.floor(100000 + Math.random() * 900000);
            user.otp = otp;
            await user.save();
            await sendEmail(email, 'Password Reset OTP', `Your OTP for password reset is: ${otp}`);
            res.status(200).json({ status: 200, success: true, message: 'OTP sent to your email.' });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async otp(req, res) {
        try {
            const { email, otp } = req.body;
            await CommonHandler.validateRequiredFields({ email, otp });
            const user = await UserRepository.getUserByEmail(email.trim());
            if (otp !== user.otp) throw new ValidationError('Invalid OTP.');
            user.otp = null;
            await user.save();
            res.status(200).json({ status: 200, success: true, message: 'OTP verified successfully.' });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async changePassword(req, res) {
        try {
            const { email, password } = req.body;
            await CommonHandler.validateRequiredFields({ email, password });
            await CommonHandler.validatePasswordFormat(password);
            const user = await UserRepository.getUserByEmail(email.trim());
            if (!user) throw new NotFoundError('User not found.');
            user.password = await CommonHandler.hashPassword(password);
            await user.save();
            res.status(200).json({ status: 200, success: true, message: 'Password reset successfully.' });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    //Static Methods Only For This Class (Not To Be Used In Routes)
    static async validateAndFetchUserByUserId(userId) {
        await CommonHandler.validateSixDigitIdFormat(userId);
        const user = await UserRepository.getUserByUserId(userId);
        if (!user) { throw new NotFoundError(`User with userId: ${userId} does not exist`); }
        return user;
    }

    static async getUser(user) {
        if (typeof user !== 'string') throw new ValidationError('Invalid email, userId, or mobile provided in string format.');
        if (user.includes('@')) return UserRepository.getUserByEmail(user);
        if (/^\d{10}$/.test(user)) return UserRepository.getUserByMobile(parseInt(user, 10));
        if (!isNaN(user)) return UserRepository.getUserByUserId(user);
        throw new ValidationError('Invalid email, userId, or mobile provided.');
    }

    static async validateUserData(data) {
        const { userName, email, mobile, password, packageName, role, panNumber, gstNumber, address, status } = data;

        await CommonHandler.validateRequiredFields({ userName, email, mobile, password });
        await UserRegistrationController.checkExistingUser(email.toUpperCase(), mobile);

        if (userName) { await CommonHandler.validateNameFormat(userName); }
        if (email) { await CommonHandler.validateEmailFormat(email); }
        if (mobile) { await CommonHandler.validateMobileFormat(mobile); }
        if (password) { await CommonHandler.validatePasswordFormat(password); }
        if (role) { await CommonHandler.validateRole(role); }
        if (panNumber) { await CommonHandler.validatePanCardFormat(panNumber); }
        if (gstNumber) { await CommonHandler.validateGstNumberFormat(gstNumber); }
        if (status) { await CommonHandler.validateStatus(status); }
        data.password = await CommonHandler.hashPassword(password);

        if (packageName) {
            const packageSetup = await PackageSetupRepository.getPackageSetupByPackageName(packageName);
            if (!packageSetup) { throw new NotFoundError(`No package found by entered name: ${packageName}`); }
            const today = dayjs();
            data.packageDetails = packageSetup.servicesProvided.map(service => {
                const expirationDate = today.add(service.serviceLifeSpan, 'day').format('YYYY-MM-DD');
                return { ...service, serviceLifeEnds: expirationDate };
            });
        }
        return data;
    }

    static async checkExistingUser(email, mobile) {
        if (await UserRepository.getUserByEmail(email)) { throw new ValidationError('Email already registered.'); }
        if (await UserRepository.getUserByMobile(mobile)) { throw new ValidationError('Mobile number already registered.'); }
    }
}
export default UserRegistrationController;