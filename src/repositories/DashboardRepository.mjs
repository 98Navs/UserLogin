// src/repository/DashboardRepository.mjs
import dayjs from 'dayjs';
import TransactionHistory from '../models/TransactionHistoryModel.mjs';

class DashboardRepository {
    static async getAdminApiHitCountStats(serviceName, selectDate = null) {
        const today = dayjs().startOf('day');
        const selectedDay = selectDate ? dayjs(selectDate, 'DD-MM-YYYY').startOf('day') : null;

        const totalQuery = { serviceName, status: 'Complete' };
        const todayQuery = { ...totalQuery, createdAt: { $gte: today.toDate(), $lt: today.add(1, 'day').toDate() } };
        const selectDateQuery = selectedDay ? { ...totalQuery, createdAt: { $gte: selectedDay.toDate(), $lt: today.add(1, 'day').toDate() } } : null;

        const [totalCount, todayCount, selectDateCount] = await Promise.all([TransactionHistory.countDocuments(totalQuery), TransactionHistory.countDocuments(todayQuery), selectDateQuery ? TransactionHistory.countDocuments(selectDateQuery) : Promise.resolve(0)]);
        return { total: totalCount, today: todayCount, selectDate: selectDateQuery ? selectDateCount : null };
    }

    static async getAdminGraphStats(startDate, endDate) {
        const matchStage = { status: 'Complete', createdAt: { $gte: new Date(startDate), $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) } };
        const aggregateStats = (format) => { return TransactionHistory.aggregate([{ $match: matchStage }, { $group: { _id: { $dateToString: { format, date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]); };

        const dailyStats = aggregateStats('%Y-%m-%d');
        const weeklyStats = aggregateStats('%Y-%U');
        const monthlyStats = aggregateStats('%Y-%m');
        const yearlyStats = aggregateStats('%Y');

        const [daily, weekly, monthly, yearly] = await Promise.all([dailyStats, weeklyStats, monthlyStats, yearlyStats]);
        return { daily, weekly, monthly, yearly };
    }

    static async getUserApiHitCountStats(userId, serviceName, selectDate = null) {
        const today = dayjs().startOf('day');
        const selectedDay = selectDate ? dayjs(selectDate, 'DD-MM-YYYY').startOf('day') : null;

        const totalQuery = { userId, serviceName, status: 'Complete' };
        const todayQuery = { ...totalQuery, createdAt: { $gte: today.toDate(), $lt: today.add(1, 'day').toDate() } };
        const selectDateQuery = selectedDay ? { ...totalQuery, createdAt: { $gte: selectedDay.toDate(), $lt: today.add(1, 'day').toDate() } } : null;

        const [totalCount, todayCount, selectDateCount] = await Promise.all([TransactionHistory.countDocuments(totalQuery), TransactionHistory.countDocuments(todayQuery), selectDateQuery ? TransactionHistory.countDocuments(selectDateQuery) : Promise.resolve(0)]);
        return { total: totalCount, today: todayCount, selectDate: selectDateQuery ? selectDateCount : null };
    }

    static async getUserGraphStats(userId, startDate, endDate) {
        const matchStage = { userId: userId, status: 'Complete', createdAt: { $gte: new Date(startDate), $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) } };
        const aggregateStats = (format) => { return TransactionHistory.aggregate([{ $match: matchStage }, { $group: { _id: { $dateToString: { format, date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]); };
        
        const dailyStats = aggregateStats('%Y-%m-%d');
        const weeklyStats = aggregateStats('%Y-%U');
        const monthlyStats = aggregateStats('%Y-%m');
        const yearlyStats = aggregateStats('%Y');
        
        const [daily, weekly, monthly, yearly] = await Promise.all([dailyStats, weeklyStats, monthlyStats, yearlyStats]);
        return { daily, weekly, monthly, yearly };
    }
}
export default DashboardRepository;