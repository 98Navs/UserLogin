// src/repositories/ServiceTableRepository.mjs
import ServiceTable from '../models/ServiceTableModel.mjs';

class ServiceTableRepository {
    static async createServiceTable(serviceTableData) { return await ServiceTable.create(serviceTableData); }

    static async getServiceTableByServiceName(serviceName) { return await ServiceTable.findOne({ serviceName: new RegExp(`^${serviceName}`, 'i') }); }

    static async getServiceTableByServiceId(serviceId) { return await ServiceTable.findOne({ serviceId }); }
}
export default ServiceTableRepository;