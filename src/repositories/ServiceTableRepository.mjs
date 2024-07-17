// src/repositories/ApiPartiesRepository.mjs
import ServiceTable from '../models/ServiceTableModel.mjs';
import { paginate } from '../project_setup/Utils.mjs';
//serviceTable
class ServiceTableRepository {
    static async createServiceTable(serviceTableData) { return await ServiceTable.create(serviceTableData); }

    static async getServiceTableByServiceName(serviceName) { return await ServiceTable.findOne({ serviceName: new RegExp(`^${serviceName}`, 'i') }); }

    static async getServiceTableByServiceId(serviceId) { return await ServiceTable.findOne({ serviceId }); }
}

export default ServiceTableRepository;