// src/repositories/ApiPartiesRepository.mjs
import ApiParties from '../models/ApiPartiesModel.mjs';
import { paginate } from '../project_setup/Utils.mjs';

class ApiPartiesRepository {
    static async createApiParty(apiPartiesData) { return await ApiParties.create(apiPartiesData); }

    static async getAllApiPartiess(options, req) { return await paginate(ApiParties, {}, options.page, options.limit, req); }

    static async getAllApiParties() { return await ApiParties.find({ primary: 'Yes' }); }

    static async getApiPartyByApiOperatorId(apiOperatorId) { return await ApiParties.findOne({ apiOperatorId }); }

    static async getApiPartyByServiceNameAndApiOperatorName({ serviceName, apiOperatorName }) { return await ApiParties.findOne({ serviceName: new RegExp(`^${serviceName}`, 'i'), apiOperatorName: new RegExp(`^${apiOperatorName}`, 'i') }); }

    static async getApiPartyByServiceName(serviceName) { return await ApiParties.findOne({ serviceName: new RegExp(`^${serviceName}`, 'i') }); }

    static async getCurrentPrimaryByServiceName(serviceName) { return await ApiParties.findOne({ serviceName, primary: 'Yes' }); }

    static async getCurrentPrimaryByServiceName(serviceName) { return await ApiParties.findOne({ serviceName, primary: 'Yes' }); }

    static async updateApiPartyDetailsByApiOperatorId(apiOperatorId, updateData) { return await ApiParties.findOneAndUpdate({ apiOperatorId }, updateData, { new: true }); }

    static async filterApiParties( filterParams, options, req) {
        const query = { primary: 'Yes' };
        if (filterParams.status) { query.status = new RegExp(`^${filterParams.status}`, 'i'); }
        if (filterParams.search) {
            const searchRegex = new RegExp(`^${filterParams.search}`, 'i');
            query.$or = [
                { serviceName: searchRegex },
                { category: searchRegex },
            ];
        }
        if (filterParams.startDate || filterParams.endDate) {
            query.createdAt = {};
            if (filterParams.startDate) query.createdAt.$gte = new Date(filterParams.startDate);
            if (filterParams.endDate) { query.createdAt.$lte = new Date(new Date(filterParams.endDate).setHours(23, 59, 59, 999)); }
        }
        return await paginate(ApiParties, query, options.page, options.limit, req);
    }
}
export default ApiPartiesRepository;