// src/repository/PaymentRepository.mjs
import Payment from "../models/PaymentModel.mjs";
import { paginate } from "../project_setup/Utils.mjs";

class PaymentRepository {
    static async createPayment(paymentData) { return await Payment.create(paymentData); }

    static async getAllPayments(options, req) { return await paginate(Payment, {}, options.page, options.limit, req); }

    static async getPaymentByPaymentId(paymentId) { return await Payment.findOne({ paymentId }); }

    static async updatePaymentByPaymentId(paymentId, status) { return await Payment.findOneAndUpdate({ paymentId }, status, { new: true }); }

    static async deletePaymentByPaymentId(paymentId) { return await Payment.findOneAndDelete({ paymentId }); }

    static async filterPayments(filterParams, options, req) {
        const query = {};
        
        if (filterParams.status && filterParams.status !== "All") { query.status = new RegExp(`^${filterParams.status}`, 'i'); }
        if (filterParams.search) {
            const searchRegex = new RegExp(`^${filterParams.search}`, 'i');
            query.$or = [
                { $expr: { $regexMatch: { input: { $toString: "$userId" }, regex: searchRegex } } },
                { $expr: { $regexMatch: { input: { $toString: "$paymentId" }, regex: searchRegex } } },
                { userName: searchRegex }
            ];
        }
        if (filterParams.startDate || filterParams.endDate) {
            query.createdAt = {};
            if (filterParams.startDate) query.createdAt.$gte = new Date(filterParams.startDate);
            if (filterParams.endDate) { query.createdAt.$lte = new Date(new Date(filterParams.endDate).setHours(23, 59, 59, 999)); }
        }
        return await paginate(Payment, query, options.page, options.limit, req);
    }
}
export default PaymentRepository;