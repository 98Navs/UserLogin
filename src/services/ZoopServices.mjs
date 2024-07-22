import axios from 'axios';
import { AdminBalanceError } from '../controllers/CommonHandler.mjs';

const ZOOP_PAN_LITE_API_URL = 'https://test.zoop.one/api/v1/in/identity/pan/lite';
const ZOOP_EPIC_API_URL = 'https://live.zoop.one/api/v1/in/identity/voter/advance';


export async function verifyPanNumberByZoop(customerPanNumber) {
    try {
        const response = await axios.post(ZOOP_PAN_LITE_API_URL, {
            data: {
                customer_pan_number: customerPanNumber,
                consent: 'Y',
                consent_text: 'I hereby declare my consent agreement for fetching my information via ZOOP API.'
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.ZOOP_API_KEY,
                'app-id': process.env.ZOOP_APP_ID
            }
        });

        return response.data;
    } catch (error) {
        if (error.response.data.response_code === 112) { throw new AdminBalanceError(error.response.data.response_message) };
        throw new Error(`Error: ${error.response ? error.response.statusText : error.message}`);
    }
}
export async function verifyVoterByZoop(customerEpic) {
    try {
            const response = await axios.post(ZOOP_EPIC_API_URL, {
                data: {
                    customer_epic_number: customerEpic,
                    consent: 'Y',
                    consent_text: 'I hear by declare my consent agreement for fetching my information via ZOOP API'
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.ZOOP_API_KEY,
                    'app-id': process.env.ZOOP_APP_ID
                }
            });
            return response.data;
    } catch (error) {
        console.log(error);
            if (error.response.data.response_code === 112) { throw new AdminBalanceError(error.response.data.response_message) };
            throw new Error(`Error: ${error.response ? error.response.statusText : error.message}`);
        }
    }