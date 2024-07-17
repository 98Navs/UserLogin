import axios from 'axios';

const ZOOP_API_URL = 'https://test.zoop.one/api/v1/in/identity/pan/lite';

export async function verifyPanNumber(customerPanNumber) {
    try {
        const response = await axios.post(ZOOP_API_URL, {
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
        throw new Error(`Error: ${error.response ? error.response.statusText : error.message}`);
    }
}
