import axios from 'axios';
import { ApiError } from '../controllers/CommonHandler.mjs';

const ZOOP_PAN_LITE_API_URL = 'https://test.zoop.one/api/v1/in/identity/pan/lite';
const ZOOP_PAN_ADVANCE_API_URL = 'https://test.zoop.one/api/v1/in/identity/pan/advance';
const ZOOP_PAN_DEMOGRAPHIC_URL = 'https://test.zoop.one/api/v1/in/identity/pan/demographic';
const ZOOP_EPIC_API_URL = 'https://test.zoop.one/api/v1/in/identity/voter/advance';
const ZOOP_DRIVING_LICENCE_ADVANCE_URL = 'https://test.zoop.one/api/v1/in/identity/dl/advance';


export async function verifyPanLiteByZoop(customerPanNumber) {
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
        if (error.response.data.response_code === 112) { throw new ApiError(error.response.data.response_message) };
        if (error.response.data.response_code === 403) { throw new ApiError(error.response.data.response_message) };
        throw new Error(`Error: ${error.response ? error.response.statusText : error.message}`);
    }
}

export async function verifyPanAdvanceByZoop(customerPanNumber) {
    try {
        const response = await axios.post(ZOOP_PAN_ADVANCE_API_URL, {
            data: {
                customer_pan_number: customerPanNumber,
                consent: 'Y',
                consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API."
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
        if (error.response.data.response_code === 112) { throw new ApiError(error.response.data.response_message) };
        if (error.response.data.response_code === 403) { throw new ApiError(error.response.data.response_message) };
        throw new Error(`Error: ${error.response ? error.response.statusText : error.message}`);
    }
}

export async function verifyPanDemographicByZoop({ customerPan, customerDob, customerName }) {
    try {
        const response = await axios.post(ZOOP_PAN_DEMOGRAPHIC_URL, {
            data: {
                customer_pan_number: customerPan,
                customer_dob: customerDob,
                user_name: customerName,
                consent: 'Y',
                consent_text: 'Approve the values here'
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
        if (error.response?.data?.response_code !== 100) { throw new ApiError(error.response.data.response_message); }
        throw new Error(`Error: ${error.response ? error.response.statusText : error.message}`);
    }
}

export async function verifyDrivingLicenceAdvanceByZoop({ customerDLN, customerDob }) {
    try {
        //console.log(customerDL, customerDob, customerName);
        const response = await axios.post(ZOOP_DRIVING_LICENCE_ADVANCE_URL, {
            data: {
                customer_dl_number: customerDLN,
                customer_dob: customerDob,
                consent: "Y",
                consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API"            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.ZOOP_API_KEY,
                'app-id': process.env.ZOOP_APP_ID
            }
        });
        return response.data;
    } catch (error) {
        //console.log(error.response);
        if (error.response?.data?.response_code !== 100) { throw new ApiError(error.response.data.response_message); }
        throw new Error(`Error: ${error.response ? error.response.statusText : error.message}`);
    }
}

export async function verifyVoterAdvanceByZoop(customerEpic) {
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
        if (error.response.data.response_code === 112) { throw new ApiError(error.response.data.response_message) };
        if (error.response.data.response_code === 403) { throw new ApiError(error.response.data.response_message) };
        throw new Error(`Error: ${error.response ? error.response.statusText : error.message}`);
    }
}