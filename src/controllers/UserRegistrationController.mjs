// src/controllers/UserRegistrationController.mjs
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import axios from 'axios';
import UserRepository from '../repositories/UserRepository.mjs';
import PackageSetupRepository from '../repositories/PackageSetupRepository.mjs';
import UserLoginLogsRepository from '../repositories/UserLoginLogsRepository.mjs';
import { CommonHandler, ValidationError, NotFoundError } from './CommonHandler.mjs';
import { sendEmail } from '../project_setup/Utils.mjs';
import Middleware from '../project_setup/Middleware.mjs';

class UserRegistrationController{
    static async createUser(req, res) {
        try {
            const userData = await UserRegistrationController.validateUserData(req.body);
            console.log(userData);
            const user = await UserRepository.createUser(userData);
            res.status(201).json({ status: 201, success: true, message: 'User created successfully', user });
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
            await UserLoginLogsRepository.createUserLoginLogs({ userId: existingUser.userId, ipAddress: ipAddress, deviceName: deviceName, location: location });
            res.status(200).json({ status: 200, success: true, message: 'Sign in successful!', user: { userId: existingUser.userId, email: existingUser.email, role: existingUser.role, token } });
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

    static async sendOtp(req, res) {
        try {
            const { email } = req.body;
            await CommonHandler.validateRequiredFields({ email });
            await CommonHandler.validateEmailFormat(email.trim());
            const user = await UserRepository.getUserByEmail(email.trim());
            if (!user) throw new NotFoundError('User not found.');
            const otp = Math.floor(100000 + Math.random() * 900000);
            user.otp = otp;
            await user.save();
            await sendEmail(email, 'OTP from Document Verification', `Your OTP is: ${otp}`);
            res.status(200).json({ status: 200, success: true, message: 'OTP sent to your email.' });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async verifyOtp(req, res) {
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
                    areaNames.push({ areaName: "Other" });
                return res.status(200).json({ status: 200, success: true, message: `Area details for pin code ${pinCode} fetched successfully`, data: { country, state, district, areaNames } });
                }
            }
            throw new NotFoundError(`No data found for pin code ${pinCode}`);
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getAllAvailablePackageSetupNames(req, res) {
        try {
            const availablePackages = await PackageSetupRepository.getAllAvailablePackageSetupNames();
            if (!availablePackages) { throw new NotFoundError('No packages found'); }
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
            const serviceTypes = availableServices.servicesProvided.map(service => ({ serviceType: service.serviceType, checked: false }));
            serviceTypes.unshift({ serviceType: 'ALL', checked: false });
            res.status(200).json({ status: 200, success: true, message: 'Service types fetched successfully', data: serviceTypes });
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
        const { userName, email, mobile, password, packageName, serviceType, role, panNumber, gstNumber, companyName, companyAddress, companyUrl, status, addressDetails: { address, city, district, state, pinCode } = {} } = data;

        await CommonHandler.validateRequiredFields({ userName, email, mobile, panNumber, address, city, district, state, pinCode });
        await UserRegistrationController.checkExistingUser(email, mobile);

        if (userName) { await CommonHandler.validateNameFormat(userName); }
        if (email) { await CommonHandler.validateEmailFormat(email); }
        if (mobile) { await CommonHandler.validateMobileFormat(mobile); }
        if (role) { await CommonHandler.validateRole(role); }
        if (panNumber) { await CommonHandler.validatePanCardFormat(panNumber); }
        //if (gstNumber) { await CommonHandler.validateGstNumberFormat(gstNumber); }
        if (status) { await CommonHandler.validateStatus(status); }
        if (pinCode) { await CommonHandler.validatePinCodeFormat(pinCode); }
        if (password) {
            await CommonHandler.validatePasswordFormat(password);
            data.password = await CommonHandler.hashPassword(password);
        } else {
            const newPassword = UserRegistrationController.generateRandomPassword();
            await sendEmail(email, `Login Credintials for Verify Documentation `,`Hi Mr./Ms ${userName.toUpperCase()}, \n \n Welcome to verify documentation \n Your login ID is:  ${email.toUpperCase()} \n Your login password is: ${newPassword}`);
            data.password = await CommonHandler.hashPassword(newPassword);
        }
            
        if (packageName ) {
            const packageSetup = await PackageSetupRepository.getPackageSetupByPackageName(packageName);
            if (!packageSetup) { throw new NotFoundError(`No package found by entered name: ${packageName}`); }
            const today = dayjs();
            const allServicesActive = serviceType && serviceType.includes('ALL') || null;
            data.packageLifeSpan = today.add(packageSetup.packageLifeSpan, 'day').format('YYYY-MM-DD');
            data.packageDetails = packageSetup.servicesProvided.map(service => ({...service,status: allServicesActive || serviceType?.includes(service.serviceType) ? 'Active' : 'InActive', serviceChecked: allServicesActive || serviceType?.includes(service.serviceType)
            }));
        }
        
        return data;
    }

    static generateRandomPassword(length = 8) {
        const chars = { upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower: 'abcdefghijklmnopqrstuvwxyz', num: '0123456789', special: '!@#$%^&*()_+[]{}|;:,.<>?' };
        let password = Object.values(chars).map(set => set[Math.floor(Math.random() * set.length)]).join('');
        const allChars = Object.values(chars).join('');
        for (let i = 4; i < length; i++) password += allChars[Math.floor(Math.random() * allChars.length)];
        return password.split('').sort(() => 0.5 - Math.random()).join('');
    }

    static async checkExistingUser(email, mobile) {
        if (await UserRepository.getUserByEmail(email)) { throw new ValidationError('Email already registered.'); }
        if (await UserRepository.getUserByMobile(mobile)) { throw new ValidationError('Mobile number already registered.'); }
    }
}
export default UserRegistrationController;