import ApiPartiesRepository from '../repositories/ApiPartiesRepository.mjs';
import WalletRepository from '../repositories/WalletRepository.mjs';
import TransactionHistoryRepository from '../repositories/TransactionHistoryRepository.mjs';
import { verifyPanNumberByZoop, verifyVoterByZoop } from '../services/ZoopServices.mjs'
import { CommonHandler, ValidationError, NotFoundError, UserBalanceError } from './CommonHandler.mjs';


class VerifyPanController {
    static PANCARD = 'PAN CARD';
    static VOTERCARD = 'VOTER CARD';

    static async verifyPanLite(req, res) {
        try {
            const { customerPanNumber } = req.body;
            const { userId } = req.user;
            
            const customerPan = customerPanNumber.toUpperCase()
            await CommonHandler.validateRequiredFields({ customerPanNumber });
            await CommonHandler.validatePanCardFormat(customerPan);

            const userWallet = await WalletRepository.getWalletByUserId(userId);
            if (!userWallet) { throw new NotFoundError(`User wallet not found for userId: ${userId}`) };

            const apiParty = await ApiPartiesRepository.getCurrentPrimaryByServiceName(VerifyPanController.PANCARD);
            if (userWallet.amount < apiParty.ourCharges) { throw new UserBalanceError(`User with userId: ${userId} have insufficient funds, Current wallet balance is RS: ${userWallet.amount}, this service charge is RS: ${apiParty.ourCharges}`) };
            userWallet.amount -= apiParty.ourCharges;
            await userWallet.save();

            const transactionHistoryData = { userId: userId, serviceName: apiParty.serviceName, apiOperatorName: apiParty.apiOperatorName, category: apiParty.category, amount: apiParty.ourCharges, type: 'Debit', reason: `PAN verification, User input:${customerPan}, Result pending from:${apiParty.apiOperatorName}` };
            const transaction = await TransactionHistoryRepository.createTransactionHistory(transactionHistoryData);
            switch (apiParty.apiOperatorName) {
                case 'ZOOP':
                    const zoopResult = await verifyPanNumberByZoop(customerPan);
                    const zoopData = { panNumber: zoopResult.result.pan_number, panStatus: zoopResult.result.pan_status, userName: zoopResult.result.user_full_name, panType: zoopResult.result.pan_type };
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `PAN verification, Api resopnse:${zoopResult.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    if (zoopResult.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User PAN details fetched successfully`, data: zoopData }); }
                    else { throw new ValidationError(`Details not found for customer PAN Number: ${customerPan}`); }
                    break;
                case 'SCRIZA':
                    const scrizaResult = await verifyPanNumberByZoop(customerPan);
                    const scrizaData = { panNumber: scrizaResult.result.pan_number, panStatus: scrizaResult.result.pan_status, userName: scrizaResult.result.user_full_name, panType: scrizaResult.result.pan_type };
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `PAN verification, Api resopnse:${scrizaResult.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    if (scrizaResult.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User PAN details fetched successfully`, data: scrizaData }); }
                    else throw new ValidationError(`Details not found for customer PAN Number: ${customerPan}`);
                    break;
                default:
                    throw new NotFoundError('Operator not found');
            }
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async verifyVoterAdvance(req, res) {
        try {
            const { customerEpicNumber } = req.body;
            const { userId } = req.user;


            const customerEpic = customerEpicNumber.toUpperCase()
            await CommonHandler.validateRequiredFields({ customerEpicNumber });
            //await CommonHandler.validatePanCardFormat(customerEpic);
            console.log(customerEpic);

            const userWallet = await WalletRepository.getWalletByUserId(userId);
            if (!userWallet) { throw new NotFoundError(`User wallet not found for userId: ${userId}`) };

            const apiParty = await ApiPartiesRepository.getCurrentPrimaryByServiceName(VerifyPanController.VOTERCARD);
            if (userWallet.amount < apiParty.ourCharges) { throw new UserBalanceError(`User with userId: ${userId} have insufficient funds, Current wallet balance is RS: ${userWallet.amount}, this service charge is RS: ${apiParty.ourCharges}`) };
            userWallet.amount -= apiParty.ourCharges;
            await userWallet.save();

            const transactionHistoryData = { userId: userId, serviceName: apiParty.serviceName, apiOperatorName: apiParty.apiOperatorName, category: apiParty.category, amount: apiParty.ourCharges, type: 'Debit', reason: `PAN verification, User input:${customerEpic}, Result pending from:${apiParty.apiOperatorName}` };
            const transaction = await TransactionHistoryRepository.createTransactionHistory(transactionHistoryData);
            switch (apiParty.apiOperatorName) {
                case 'ZOOP':
                    const zoopResult = await verifyVoterByZoop(customerEpic);
                    console.log(zoopResult);

                    const zoopData = { panNumber: zoopResult.result.pan_number, panStatus: zoopResult.result.pan_status, userName: zoopResult.result.user_full_name, panType: zoopResult.result.pan_type };
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `PAN verification, Api resopnse:${zoopResult.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    if (zoopResult.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User PAN details fetched successfully`, data: zoopResult.result }); }
                    else { throw new ValidationError(`Details not found for customer PAN Number: ${customerEpic}`); }
                    break;
                case 'SCRIZA':
                    const scrizaResult = await verifyVoterByZoop(customerEpic);
                    const scrizaData = { panNumber: scrizaResult.result.pan_number, panStatus: scrizaResult.result.pan_status, userName: scrizaResult.result.user_full_name, panType: scrizaResult.result.pan_type };
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `PAN verification, Api resopnse:${scrizaResult.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    if (scrizaResult.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User PAN details fetched successfully`, data: scrizaData }); }
                    else throw new ValidationError(`Details not found for customer PAN Number: ${customerEpic}`);
                    break;
                default:
                    throw new NotFoundError('Operator not found');
            }
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }
}
export default VerifyPanController;