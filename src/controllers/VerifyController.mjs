import ApiPartiesRepository from '../repositories/ApiPartiesRepository.mjs';
import WalletRepository from '../repositories/WalletRepository.mjs';
import TransactionHistoryRepository from '../repositories/TransactionHistoryRepository.mjs';
import { verifyPanLiteByZoop, verifyPanAdvanceByZoop, verifyPanDemographicByZoop, verifyDrivingLicenceAdvanceByZoop, verifyVoterAdvanceByZoop } from '../services/ZoopServices.mjs'
import { CommonHandler, ValidationError, NotFoundError, UserBalanceError } from './CommonHandler.mjs';


class VerifyController {
    static PANCARDLITE = 'PAN CARD';
    static PANCARDADVANCE = 'PAN CARD ADVANCE';
    static PANCARDDEMOGRAPHIC = 'PAN CARD DEMOGRAPHIC';
    static VOTERCARD = 'VOTER CARD';
    static DRIVINGLICENCEADVANCE = 'DRIVING LICENCE ADVANCE';

    static async verifyPanLite(req, res) {
        try {
            const { customerPanNumber } = req.body;
            const { userId } = req.user;

            const customerPan = customerPanNumber.toUpperCase()
            await CommonHandler.validateRequiredFields({ customerPanNumber });
            await CommonHandler.validatePanCardFormat(customerPan);

            const userWallet = await WalletRepository.getWalletByUserId(userId);
            if (!userWallet) { throw new NotFoundError(`User wallet not found for userId: ${userId}`) };

            const apiParty = await ApiPartiesRepository.getCurrentPrimaryByServiceName(VerifyController.PANCARD);
            if (userWallet.amount < apiParty.ourCharges) { throw new UserBalanceError(`User with userId: ${userId} have insufficient funds, Current wallet balance is RS: ${userWallet.amount}, this service charge is RS: ${apiParty.ourCharges}`) };
            userWallet.amount -= apiParty.ourCharges;
            await userWallet.save();

            const transactionHistoryData = { userId: userId, serviceName: apiParty.serviceName, apiOperatorName: apiParty.apiOperatorName, category: apiParty.category, amount: apiParty.ourCharges, type: 'Debit', reason: `PAN lite verification, User input:${customerPan}, Result pending from:${apiParty.apiOperatorName}` };
            const transaction = await TransactionHistoryRepository.createTransactionHistory(transactionHistoryData);
            switch (apiParty.apiOperatorName) {
                case 'ZOOP':
                    const zoopResult = await verifyPanLiteByZoop(customerPan);
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `PAN lite verification, Api resopnse:${zoopResult.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    if (zoopResult.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User PAN lite details fetched successfully`, data: zoopResult.result }); }
                    else { throw new ValidationError(`Details not found for customer PAN Number: ${customerPan}`); }
                    break;
                case 'SCRIZA':
                    const scrizaResult = await verifyPanLiteByScriza(customerPan);
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `PAN lite verification, Api resopnse:${scrizaResult.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    if (scrizaResult.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User PAN lite details fetched successfully`, data: scrizaResult.result }); }
                    else throw new ValidationError(`Details not found for customer PAN Number: ${customerPan}`);
                    break;
                default:
                    throw new NotFoundError('Operator not found');
            }
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async verifyPanAdvance(req, res) {
        try {
            const { customerPanNumber } = req.body;
            const { userId } = req.user;

            const customerPan = customerPanNumber.toUpperCase()
            await CommonHandler.validateRequiredFields({ customerPanNumber });
            await CommonHandler.validatePanCardFormat(customerPan);

            const userWallet = await WalletRepository.getWalletByUserId(userId);
            if (!userWallet) { throw new NotFoundError(`User wallet not found for userId: ${userId}`) };

            const apiParty = await ApiPartiesRepository.getCurrentPrimaryByServiceName(VerifyController.PANCARDADVANCE);
            if (!apiParty) { throw new NotFoundError(`Api party not found for: ${VerifyController.PANCARDADVANCE}`) };
            if (userWallet.amount < apiParty.ourCharges) { throw new UserBalanceError(`User with userId: ${userId} have insufficient funds, Current wallet balance is RS: ${userWallet.amount}, this service charge is RS: ${apiParty.ourCharges}`) };
            userWallet.amount -= apiParty.ourCharges;
            await userWallet.save();

            const transactionHistoryData = { userId: userId, serviceName: apiParty.serviceName, apiOperatorName: apiParty.apiOperatorName, category: apiParty.category, amount: apiParty.ourCharges, type: 'Debit', reason: `PAN advance verification, User input:${customerPan}, Result pending from:${apiParty.apiOperatorName}` };
            const transaction = await TransactionHistoryRepository.createTransactionHistory(transactionHistoryData);
            switch (apiParty.apiOperatorName) {
                case 'ZOOP':
                    const zoopResult = await verifyPanAdvanceByZoop(customerPan);
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `PAN advance verification, Api resopnse:${zoopResult.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    if (zoopResult.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User PAN advance details fetched successfully`, data: zoopResult.result }); }
                    else { throw new ValidationError(`Details not found for customer PAN Number: ${customerPan}`); }
                    break;
                case 'SCRIZA':
                    const scrizaResult = await verifyPanAdvanceByScriza(customerPan);
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `PAN advance verification, Api resopnse:${scrizaResult.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    if (scrizaResult.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User PAN advance details fetched successfully`, data: scrizaResult.result }); }
                    else throw new ValidationError(`Details not found for customer PAN Number: ${customerPan}`);
                    break;
                default:
                    throw new NotFoundError('Operator not found');
            }
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async verifyPanDemographic(req, res) {
        try {
            const { customerPanNumber, customerDob, customerName } = req.body;
            const { userId } = req.user;
            
            const customerPan = customerPanNumber.toUpperCase()
            await CommonHandler.validateRequiredFields({ customerPanNumber, customerDob, customerName });
            await CommonHandler.validatePanCardFormat(customerPan);

            const userWallet = await WalletRepository.getWalletByUserId(userId);
            if (!userWallet) { throw new NotFoundError(`User wallet not found for userId: ${userId}`) };

            const apiParty = await ApiPartiesRepository.getCurrentPrimaryByServiceName(VerifyController.PANCARDDEMOGRAPHIC);
            if (!apiParty) { throw new NotFoundError(`Api party not found for: ${VerifyController.PANCARDDEMOGRAPHIC}`) };
            if (userWallet.amount < apiParty.ourCharges) { throw new UserBalanceError(`User with userId: ${userId} have insufficient funds, Current wallet balance is RS: ${userWallet.amount}, this service charge is RS: ${apiParty.ourCharges}`) };
            userWallet.amount -= apiParty.ourCharges;
            await userWallet.save();

            const transactionHistoryData = { userId: userId, serviceName: apiParty.serviceName, apiOperatorName: apiParty.apiOperatorName, category: apiParty.category, amount: apiParty.ourCharges, type: 'Debit', reason: `PAN demographic verification, User input:${customerPan}, Result pending from:${apiParty.apiOperatorName}` };
            const transaction = await TransactionHistoryRepository.createTransactionHistory(transactionHistoryData);
            switch (apiParty.apiOperatorName) {
                case 'ZOOP':
                    const zoopResult = await verifyPanDemographicByZoop({ customerPan, customerDob, customerName });
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `PAN demographic verification, Api resopnse:${zoopResult.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    if (zoopResult.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User PAN demographic details fetched successfully`, data: zoopResult.result }); }
                    else { throw new ValidationError(`Details not found for customer PAN Number: ${customerPan}`); }
                    break;
                case 'SCRIZA':
                    const scrizaResult = await verifyPanDemographicByScriza({ customerPan, customerDob, customerName });
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `PAN demographic verification, Api resopnse:${scrizaResult.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    if (scrizaResult.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User PAN demographic details fetched successfully`, data: scrizaResult.result }); }
                    else throw new ValidationError(`Details not found for customer PAN Number: ${customerPan}`);
                    break;
                default:
                    throw new NotFoundError('Operator not found');
            }
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static async verifyDrivingLicenceAdvance(req, res) {
        try {
            const { customerDL, customerDob } = req.body;
            const { userId } = req.user;

            const customerDLN = customerDL.toUpperCase()
            await CommonHandler.validateRequiredFields({ customerDL, customerDob });
            await CommonHandler.validateDrivingLicenseFormat(customerDLN);

            const userWallet = await WalletRepository.getWalletByUserId(userId);
            if (!userWallet) { throw new NotFoundError(`User wallet not found for userId: ${userId}`) };

            const apiParty = await ApiPartiesRepository.getCurrentPrimaryByServiceName(VerifyController.DRIVINGLICENCEADVANCE);
            if (!apiParty) { throw new NotFoundError(`Api party not found for: ${VerifyController.DRIVINGLICENCEADVANCE}`) };
            if (userWallet.amount < apiParty.ourCharges) { throw new UserBalanceError(`User with userId: ${userId} have insufficient funds, Current wallet balance is RS: ${userWallet.amount}, this service charge is RS: ${apiParty.ourCharges}`) };
            userWallet.amount -= apiParty.ourCharges;
            await userWallet.save();

            const transactionHistoryData = { userId: userId, serviceName: apiParty.serviceName, apiOperatorName: apiParty.apiOperatorName, category: apiParty.category, amount: apiParty.ourCharges, type: 'Debit', reason: `DL advance, User input:${customerDLN}, Result pending from:${apiParty.apiOperatorName}` };
            const transaction = await TransactionHistoryRepository.createTransactionHistory(transactionHistoryData);
            switch (apiParty.apiOperatorName) {
                case 'ZOOP':
                    const zoopResult = await verifyDrivingLicenceAdvanceByZoop({ customerDLN, customerDob });
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `DL advance verification, Api resopnse:${zoopResult.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    if (zoopResult.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User DL advance details fetched successfully`, data: zoopResult.result }); }
                    else { throw new ValidationError(`Details not found for customer DL Number: ${customerDLN}`); }
                    break;
                case 'SCRIZA':
                    const scrizaResult = await verifyDrivingLicenceAdvanceByScriza({ customerDLN, customerDob });
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `DL advance verification, Api resopnse:${scrizaResult.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    if (scrizaResult.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User DL advance details fetched successfully`, data: scrizaResult.result }); }
                    else throw new ValidationError(`Details not found for customer DL Number: ${customerDLN}`);
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

            const userWallet = await WalletRepository.getWalletByUserId(userId);
            if (!userWallet) { throw new NotFoundError(`User wallet not found for userId: ${userId}`) };

            const apiParty = await ApiPartiesRepository.getCurrentPrimaryByServiceName(VerifyController.VOTERCARD);
            if (userWallet.amount < apiParty.ourCharges) { throw new UserBalanceError(`User with userId: ${userId} have insufficient funds, Current wallet balance is RS: ${userWallet.amount}, this service charge is RS: ${apiParty.ourCharges}`) };
            userWallet.amount -= apiParty.ourCharges;
            await userWallet.save();

            const transactionHistoryData = { userId: userId, serviceName: apiParty.serviceName, apiOperatorName: apiParty.apiOperatorName, category: apiParty.category, amount: apiParty.ourCharges, type: 'Debit', reason: `Voter advance verification, User input:${customerEpic}, Result pending from:${apiParty.apiOperatorName}` };
            const transaction = await TransactionHistoryRepository.createTransactionHistory(transactionHistoryData);
            switch (apiParty.apiOperatorName) {
                case 'ZOOP':
                    const zoopResult = await verifyVoterAdvanceByZoop(customerEpic);
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `Voter advance verification, Api resopnse:${zoopResult.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    if (zoopResult.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User voter advance details fetched successfully`, data: zoopResult.result }); }
                    else { throw new ValidationError(`Details not found for customer Voter Epic Number: ${customerEpic}`); }
                    break;
                case 'SCRIZA':
                    const scrizaResult = await verifyVoterAdvanceByScriza(customerEpic);
                    await TransactionHistoryRepository.updateTransactionHistoryById(transaction.id, { reason: `Voter advance verification, Api resopnse:${scrizaResult.response_message}, Result fetched successfully from:${apiParty.apiOperatorName} operator`, status: 'Complete' });
                    if (scrizaResult.response_message === 'Valid Authentication') { res.status(200).json({ status: 200, success: true, message: `User voter advance details fetched successfully`, data: scrizaData }); }
                    else throw new ValidationError(`Details not found for customer Voter Epic Number: ${customerEpic}`);
                    break;
                default:
                    throw new NotFoundError('Operator not found');
            }
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }


}
export default VerifyController;