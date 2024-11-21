// src/controllers/BankDetailsController.mjs
import BankDetailsRepository from "../repositories/BankDetailsRepository.mjs";
import UserRepository from "../repositories/UserRepository.mjs";
import { CommonHandler, ValidationError, NotFoundError } from './CommonHandler.mjs';

class BankDetailsController {
    static async createBankDetails(req, res) {
        try {
            const userId = req.user.userId;
            const bankDetailsData = await BankDetailsController.bankDetailsValidation(req.body, userId);
            const bankDetails = await BankDetailsRepository.createBankDetails(bankDetailsData);
            res.status(201).json({ status: 201, success: true, message: 'Bank details created successfully', data: bankDetails });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getAdminBankDetails(req, res) {
        try {
            const bankDetails = await BankDetailsRepository.getAdminBankDetails();
            res.status(200).json({ status: 200, success: true, message: 'Admin bank details fetched successfully', data: bankDetails });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getAdminSaveAs(req, res) {
        try {
            const admin = await UserRepository.getUserByEmail('admin@scriza.in');
            if (!admin) { throw new NotFoundError('Admin not found in the database with email: admin@scriza.in'); }
            const userData = await BankDetailsRepository.getBankDetailsByUserId(admin.userId);
            const userSaveAs = userData.map(user => ({ saveAs: user.saveAs }));
            res.status(200).json({ status: 200, success: true, message: `Admin SaveAs fetched successfully.`, data: userSaveAs });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getUserBankDetailsByUserId(req, res) {
        try {
            const { userId } = req.params;
            const bankDetails = await BankDetailsController.validateAndFetchBankByUserId(userId);
            res.status(200).json({ status: 200, success: true, message: 'User bank details fetched successfully', data: bankDetails });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getBankDetailsByBankId(req, res) {
        try {
            const { bankId } = req.params;
            const bankDetails = await BankDetailsController.validateAndFetchBankByBankId(bankId);
            res.status(200).json({ status: 200, success: true, message: 'User bank details fetched successfully', data: bankDetails });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getBankDetailsByUserIdAndSaveAs(req, res) {
        try {
            const { userId, saveAs } = req.params;
            await BankDetailsController.validateAndFetchBankByUserId(userId);
            const bankDetails = await BankDetailsRepository.getBankDetailsByUserIdAndSaveAs(userId, saveAs);
            if (!bankDetails || bankDetails.length === 0) throw new NotFoundError(`Bank details not found for entered saveAs ${saveAs}.`);
            res.status(200).json({ status: 200, success: true, message: 'Bank deatils fetched succeessfully by userId and saveAs', data: bankDetails });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async updatePrimaryAccountByBankId(req, res) {
        try {
            const { bankId } = req.params;
            const bankDetails = await BankDetailsController.validateAndFetchBankByBankId(bankId);
            const currentPrimary = await BankDetailsRepository.getCurrentPrimaryAccount(bankDetails.userId);
            if (currentPrimary) { await BankDetailsRepository.updateBankDetailsByBankId(currentPrimary.bankId, { primary: 'No' }); }
            const newPrimary = await BankDetailsRepository.updateBankDetailsByBankId(bankDetails.bankId, { primary: 'Yes' });
            res.status(200).json({ status: 200, success: true, message: 'Primary bank changed successfully', data: newPrimary });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }
    
    static async updateStatusByBankId(req, res) {
        try {
            const { bankId } = req.params;
            const { status } = req.body;
            await BankDetailsController.validateAndFetchBankByBankId(bankId);
            if (status) if (!CommonHandler.validStatuses.includes(status)) throw new ValidationError(`Status must be one of: ${CommonHandler.validStatuses.join(', ')}`);
            const bankDetails = await BankDetailsRepository.updateBankDetailsByBankId(bankId, { status: status });
            res.status(200).json({ status: 200, success: true, message: 'Bank status updated successfully', data: bankDetails });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }
    

    static async updateBankDetailsByBankId(req, res) {
        try {
            const { bankId } = req.params;
            const bankDetails = await BankDetailsController.validateAndFetchBankByBankId(bankId);
            const updatedData = await BankDetailsController.bankDetailsValidation(req.body, bankDetails.userId, true);
            const updatedBankDetails = await BankDetailsRepository.updateBankDetailsByBankId(bankId, updatedData);
            res.status(200).json({ status: 200, success: true, message: 'Bank details updated successfully', data: updatedBankDetails });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async deleteBankDetailsByBankId(req, res) {
        try {
            const { bankId } = req.params;
            await BankDetailsController.validateAndFetchBankByBankId(bankId);
            const bankDetails = await BankDetailsRepository.deleteBankDetailsByBankId(bankId);
            if (bankDetails?.primary === 'Yes') {
                const newPrimaryArray = await BankDetailsRepository.getBankDetailsByUserId(bankDetails.userId);
                const newPrimary = newPrimaryArray.length > 0 ? newPrimaryArray[0] : null;
                if (newPrimary) { await BankDetailsRepository.updateBankDetailsByBankId(newPrimary.bankId, { primary: 'Yes' }); }
            }
            res.status(200).json({ status: 200, success: true, message: 'Bank details deleted successfully', data: bankDetails });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    // Static Methods Only For This Class (Not To Be Used In Routes)
    static async validateAndFetchBankByBankId(bankId) {
        await CommonHandler.validateSixDigitIdFormat(bankId);
        const bankDetails = await BankDetailsRepository.getBankDetailsByBankId(bankId);
        if (!bankDetails) throw new NotFoundError(`Bank details not found for bankId ${bankId}.`);
        return bankDetails;
    }

    static async validateAndFetchBankByUserId(userId) {
        await CommonHandler.validateSixDigitIdFormat(userId);
        const bankDetails = await BankDetailsRepository.getBankDetailsByUserId(userId);
        if (!bankDetails || bankDetails.length === 0) throw new NotFoundError(`Bank details not found for userId ${userId}.`);
        return bankDetails;
    }

    static async bankDetailsValidation(data, userId, isUpdate = false) {
        const { bankName, accountNumber, accountHolderName, ifscCode, upiId, saveAs, status } = data;
        if (!isUpdate) await CommonHandler.validateRequiredFields({ bankName, accountNumber, accountHolderName, ifscCode, saveAs });
        if (bankName) await CommonHandler.validateNameFormat(bankName);
        if (accountNumber) await CommonHandler.validateAccountNumberFormat(accountNumber);
        if (accountHolderName) await CommonHandler.validateNameFormat(accountHolderName);
        //if (ifscCode) await CommonHandler.validateIfscCodeFormat(ifscCode);
        if (upiId) await CommonHandler.validateUpiIdFormat(upiId);
        if (saveAs) await CommonHandler.validateSaveAsFormat(saveAs);
        if (status) if(!CommonHandler.validStatuses.includes(status)) throw new ValidationError(`Status must be one of: ${CommonHandler.validStatuses.join(', ')}`);
        
        if (!isUpdate) {
            const user = await UserRepository.getUserByUserId(userId);
            if (!user) { throw new NotFoundError(`User with this userId ${userId} does not found`); }

            const bankDetails = await BankDetailsRepository.getBankDetailsByUserId(userId);
            data.primary = bankDetails.length > 0 ? 'No' : 'Yes';
            const existingSaveAs = await BankDetailsRepository.getSaveAsByUserId(userId);
            if (existingSaveAs.includes(saveAs.toUpperCase())) throw new ValidationError(`SaveAs: ${saveAs} already exists for the user with userId: ${userId}`);
        }
        data.userId = userId;
        return data;
    }
}
export default BankDetailsController;