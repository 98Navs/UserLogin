// src/repositories/ApiPartiesRepository.mjs
import ApiParties from '../models/ApiPartiesModel.mjs';
import { paginate } from '../project_setup/Utils.mjs';

class ApiPartiesRepository {
    static async createApiParty(apiPartiesData) { return await ApiParties.create(apiPartiesData); }

    static async getAllApiPartiess(options, req) { return await paginate(ApiParties, {}, options.page, options.limit, req); }

    static async getAllApiParties() { return await ApiParties.find(); }

    static async getApiPartyByApiOperatorId(apiOperatorId) { return await ApiParties.findOne({ apiOperatorId }); }

    static async getApiPartyByServiceName(serviceName) { return await ApiParties.findOne({ serviceName: new RegExp(`^${serviceName}`, 'i') }); }

    static async getCurrentPrimaryByServiceName(serviceName) { return await ApiParties.findOne({ serviceName, primary: 'Yes' }); }

    static async getCurrentPrimaryByServiceName(serviceName) { return await ApiParties.findOne({ serviceName, primary: 'Yes' }); }

    static async updateApiPartyDetailsByApiOperatorId(apiOperatorId, updateData) { return await ApiParties.findOneAndUpdate({ apiOperatorId }, updateData, { new: true }); }
}
export default ApiPartiesRepository;