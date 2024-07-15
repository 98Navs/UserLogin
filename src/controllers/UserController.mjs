// src/controllers/UserRegistrationController.mjs
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/UserRepository.mjs';
import { sendEmail } from '../project_setup/Utils.mjs';
import { CommonHandler, ValidationError, NotFoundError } from './CommonHandler.mjs';
import Middleware from '../project_setup/Middleware.mjs';

class UserController {
    static async createUser(req, res) {
        try {
            const userData = await UserController.validateUserData(req.body);
            const user = await UserRepository.createUser(userData);
            res.status(201).json({ status: 201, success: true, message: 'User created successfully', user });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async signIn(req, res) {
        try {
            const { user, password } = req.body;
            await CommonHandler.validateRequiredFields({ user, password });
            const existingUser = await UserController.getUser(user.trim());
            if (!existingUser) { throw new NotFoundError("user not found for the provided details"); }
            if (existingUser.status != 'Active') { throw new ValidationError('User account has been deleted or suspended'); }
            if (! await bcrypt.compare(password, existingUser.password)) { throw new ValidationError('Invalid credentials.'); }
            const token = await Middleware.generateToken({ userId: existingUser.userId, email: existingUser.email, role: existingUser.role }, res);
            res.status(200).json({ status: 200, success: true, message: 'Sign in successful!', user: { userId: existingUser.userId, email: existingUser.email, token } });
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

    static async getAllUsers(req, res) {
        try {
            const { search, startDate, endDate, pageNumber = 1, perpage = 10 } = req.query;
            const options = { page: Number(pageNumber), limit: Number(perpage) };
            const filterParams = { search, startDate, endDate };
            const users = Object.keys(filterParams).length > 0 ?
                await UserRepository.filterUsers(filterParams, options, req) :
                await UserRepository.getAllUsers(options, req);
            return res.status(200).json({ status: 200, success: true, message: 'Users fetched successfully', ...users });
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
        const { userName, email, mobile, password, role, status } = data;

        await CommonHandler.validateRequiredFields({ userName, email, mobile, password });
        await UserController.checkExistingUser(email.toUpperCase(), mobile);

        if (userName) { await CommonHandler.validateNameFormat(userName); }
        if (email) { await CommonHandler.validateEmailFormat(email); }
        if (mobile) { await CommonHandler.validateMobileFormat(mobile); }
        if (password) { await CommonHandler.validatePasswordFormat(password); }
        if (role) { await CommonHandler.validateRole(role); }
        if (status) { await CommonHandler.validateStatus(status); }
        data.password = await CommonHandler.hashPassword(password);

        return data;   
    }

    static async checkExistingUser(email, mobile) {
        if (await UserRepository.getUserByEmail(email)) { throw new ValidationError('Email already registered.'); }
        if (await UserRepository.getUserByMobile(mobile)) { throw new ValidationError('Mobile number already registered.'); }
    }
}

export default UserController;