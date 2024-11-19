// src/controllers/PaymentController.mjs
import PaymentRepository from '../repositories/PaymentRepository.mjs';
import UserRepository from '../repositories/UserRepository.mjs';
import BankDetailsRepository from '../repositories/BankDetailsRepository.mjs'
import { CommonHandler, ValidationError, NotFoundError } from './CommonHandler.mjs';

class PaymentController {
    static async createPayment(req, res) {
        try {
            const paymentData = await PaymentController.paymentCreateValidation(req);
            const payment = await PaymentRepository.createPayment(paymentData);
            res.status(201).json({ status: 201, success: true, message: 'Payment created successfully', data: payment });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getAllPayments(req, res) {
        try {
            const { status, search, startDate, endDate, pageNumber = 1, perpage = 10 } = req.query;
            const options = { page: Number(pageNumber), limit: Number(perpage) };
            const filterParams = { status, search, startDate, endDate };
            const payment = Object.keys(filterParams).length > 0 ?
                await PaymentRepository.filterPayments(filterParams, options, req) :
                await PaymentRepository.getAllPayments(options, req);
            res.status(200).json({ status: 200, success: true, message: 'All payments fetched successfully', data: payment });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async getAllUserPayments(req, res) {
        try {
            const userId = req.user.userId;
            const { status, search, startDate, endDate, pageNumber = 1, perpage = 10 } = req.query;
            const options = { page: Number(pageNumber), limit: Number(perpage) };
            const filterParams = { status, search, startDate, endDate, userId };
            const payment = Object.keys(filterParams).length > 0 ?
                await PaymentRepository.filterPayments(filterParams, options, req) :
                await PaymentRepository.getAllUserPayments(options, userId, req);
            res.status(200).json({ status: 200, success: true, message: 'All user payments fetched successfully', data: payment });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }


    static async getPaymentByPaymentId(req, res) {
        try {
            const { paymentId } = req.params;
            const payment = await PaymentController.validateAndFetchPaymentByPaymentId(paymentId);
            res.status(200).json({ status: 200, success: true, message: 'Payment fetched successfully', data: payment });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async updatePaymentByPaymentId(req, res) {
        try {
            const updatePayment = await PaymentController.paymentUpdateValidation(req);
            res.status(200).json({ status: 200, success: true, message: 'Payment status updated successfully', data: updatePayment });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async deletePaymentByPaymentId(req, res) {
        try {
            const { paymentId } = req.params;
            await PaymentController.validateAndFetchPaymentByPaymentId(paymentId);
            const deletedPayment = await PaymentRepository.deletePaymentByPaymentId(paymentId);
            res.status(200).json({ status: 200, success: true, message: 'Payment deleted successfully', data: deletedPayment });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    // Static Methods Only For This Class (Not To Be Used In Routes)
    static async validateAndFetchPaymentByPaymentId(paymentId) {
        await CommonHandler.validateSixDigitIdFormat(paymentId);
        const payment = await PaymentRepository.getPaymentByPaymentId(paymentId);
        if (!payment) { throw new NotFoundError(`Payment with paymentId: ${paymentId} not found`); }
        return payment;
    }

    static async paymentCreateValidation(data) {
        const { transactionNo, saveAs, amount, depositDate, paymentMethod } = data.body;
        const { userId } = data.user;
        await CommonHandler.validateRequiredFields({ transactionNo, saveAs, amount, depositDate, paymentMethod });
        await CommonHandler.validateSixDigitIdFormat(userId);
        await CommonHandler.validateTransactionFormat(transactionNo);

        const admin = await UserRepository.getUserByEmail('admin@scriza.in');
        if (!admin) { throw new NotFoundError(`Admin with email: admin@scriza.in does not exist`); }
        const bankDetails = await BankDetailsRepository.getBankDetailsByUserIdAndSaveAs(admin.userId, saveAs);
        if (!bankDetails) { throw new NotFoundError(`Admin bank details not found with ${saveAs}.`); }
        const existingTransactionNo = await PaymentRepository.getPaymentByTransactionNo(transactionNo);
        if (existingTransactionNo) { throw new ValidationError('Duplicate UTR No. detected, Provide new UTR as this one is already registered.'); }
        data.body.bankName = bankDetails.saveAs;

        const existingUser = await UserRepository.getUserByUserId(userId);
        if (!existingUser) { throw new NotFoundError(`User with userId: ${userId} does not exist`); }
        data.body.userId = existingUser.userId;
        data.body.userName = existingUser.userName;

        return data.body;
    }

    static async paymentUpdateValidation(data) {
        const { paymentId } = data.params;
        let { status } = data.query;

        await CommonHandler.validateRequiredFields({ status });
        await CommonHandler.validatePaymentStatus(status);

        const payment = await PaymentController.validateAndFetchPaymentByPaymentId(paymentId);
        const user = await UserRepository.getUserByUserId(payment.userId);

        if (!user || user.status !== 'Active') {
            status = 'Rejected';
            await PaymentRepository.updatePaymentByPaymentId(paymentId, { status });
            throw new NotFoundError(`User wallet with userId: ${payment.userId} either does not exist or user status is Inactive. \n Request has been rejected.`);
        } 

        if (status === 'Approved') {
            user.amount += payment.amount;
            user.save();
        }

        const updatePayment = await PaymentRepository.updatePaymentByPaymentId(paymentId, { status });
        return updatePayment;
    }
}
export default PaymentController;