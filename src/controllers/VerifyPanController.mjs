import ApiPartiesRepository from '../repositories/ApiPartiesRepository.mjs';
import WalletRepository from '../repositories/WalletRepository.mjs';
import { verifyPanNumberByZoop } from '../services/ZoopService.mjs'
import { CommonHandler, ValidationError, NotFoundError } from './CommonHandler.mjs';


class VerifyPanController {
    static PANCARD = 'PAN CARD';
    static async verifyPan(req, res) {
        try {
            const { customerPanNumber } = req.body;
            const { userId } = req.user;

            const userWallet = await WalletRepository.getWalletByUserId(userId);
            if (!userWallet) { throw new NotFoundError(`User wallet not found for userId: ${userId}`) };

            const apiParty = await ApiPartiesRepository.getCurrentPrimaryByServiceName(VerifyPanController.PANCARD);
            if (userWallet.amount < apiParty.ourCharges) { throw new ValidationError(`User with userId: ${userId} have insufficient funds, Current wallet balance is RS: ${userWallet.amount}, this service charge is RS: ${apiParty.ourCharges}`) };

            switch (apiParty.apiOperatorName) {
                case 'ZOOP':
                    const zoopResult = await verifyPanNumberByZoop(customerPanNumber);
                    if (zoopResult.metadata.billable === 'Y') {
                        userWallet.amount -= apiParty.ourCharges;
                        await userWallet.save();
                    }
                    res.status(200).json({ status: 200, success: true, message: `User PAN details fetched successfully`, data: zoopResult.result });
                    break;
                case 'SCRIZA':
                    const scrizaResult = await verifyPanNumberByZoop(customerPanNumber);
                    if (scrizaResult.metadata.billable === 'Y') {
                        userWallet.amount -= apiParty.ourCharges;
                        await userWallet.save();
                    }
                    res.status(200).json({ status: 200, success: true, message: `User PAN details fetched successfully`, data: scrizaResult.result });
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