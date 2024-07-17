import ApiPartiesRepository from '../repositories/ApiPartiesRepository.mjs';
import WalletRepository from '../repositories/WalletRepository.mjs';
import { verifyPanNumber } from '../services/zoopService.mjs'
import { CommonHandler, ValidationError, NotFoundError } from './CommonHandler.mjs';


class VerifyPanController {
    static PANCARD = 'PAN CARD';
    static async verifyPan(req, res) {
        try {
            const { customerPanNumber } = req.body;
            const { userId } = req.user;

            const userWallet = await WalletRepository.getWalletByUserId(userId);
            if (!userWallet) { throw new NotFoundError(`User wallet not found for userId: ${userId}`) };

            const apiParty = await ApiPartiesRepository.getCurrentPrimaryByOperationName(VerifyPanController.PANCARD);
            if (userWallet.amount < apiParty.ourCharges) { throw new ValidationError(`User with userId: ${userId} have insufficient funds, Current wallet balance is RS: ${userWallet.amount}, this service charge is RS: ${apiParty.ourCharges}`) };
            switch (apiParty.operationName) {
                case 'ZOOP':
                    break;
                case 'SCRIZA':
                    break;
                default:
                    throw new ValidationError('Operator not found');
            }
            const apiResult = await verifyPanNumber(customerPanNumber);

            if (apiResult.metadata.billable === 'Y') {
                userWallet.amount -= apiParty.ourCharges;
                await userWallet.save();
            }

            res.status(200).json({ status: 200, success: true, message: `User PAN details fetched successfully`, data: apiResult.result });
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }
}
export default VerifyPanController;