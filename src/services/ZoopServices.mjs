import axios from 'axios';

const ZOOP_API_URLS = {
    PAN_LITE: 'https://test.zoop.one/api/v1/in/identity/pan/lite',
    PAN_ADVANCE: 'https://test.zoop.one/api/v1/in/identity/pan/advance',
    PAN_DEMOGRAPHIC: 'https://test.zoop.one/api/v1/in/identity/pan/demographic',
    EPIC: 'https://test.zoop.one/api/v1/in/identity/voter/advance',
    DRIVING_LICENCE_ADVANCE: 'https://test.zoop.one/api/v1/in/identity/dl/advance',
    PASSPORT_LITE: 'https://test.zoop.one/api/v1/in/identity/passport/lite',
    CKYC_LITE: 'https://test.zoop.one/api/v1/in/identity/ckyc/lite',
    OKYC_LITE: 'https://test.zoop.one/in/identity/okyc/otp/request',
    OKYC_OTP_LITE: 'https://test.zoop.one/in/identity/okyc/otp/verify',
    GSTIN_LITE: 'https://test.zoop.one/api/v1/in/merchant/gstin/lite',
    GSTIN_ADVANCE: 'https://test.zoop.one/api/v1/in/merchant/gstin/advance',
    BANK_VERIFICATION_LITE: 'https://test.zoop.one/api/v1/in/financial/bav/lite',
    RC_LITE: 'https://test.zoop.one/api/v1/in/vehicle/rc/lite',
    RC_ADVANCE: 'https://test.zoop.one/api/v1/in/vehicle/rc/advance',
    IFSC_LITE: 'https://test.zoop.one/api/v1/in/utility/ifsc/lite',
    OCR_LITE: 'https://test.zoop.one/api/v1/in/utility/ocr/lite'
};

const ZOOP_HEADERS = {
    'Content-Type': 'application/json',
    'api-key': process.env.ZOOP_API_KEY,
    'app-id': process.env.ZOOP_APP_ID
};

async function makeZoopRequest(url, data) {
    try {
        //console.log(data);
        const response = await axios.post(url, { data }, { headers: ZOOP_HEADERS });
        return response.data;
    } catch (error) {
        return error.response;
    }
}

export async function verifyPanLiteByZoop(documentDetails) {
    const { customerPan } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.PAN_LITE, {
        customer_pan_number: customerPan,
        consent: 'Y',
        consent_text: 'I hereby declare my consent agreement for fetching my information via ZOOP API.'
    });
}

export async function verifyPanAdvanceByZoop(documentDetails) {
    const { customerPan } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.PAN_ADVANCE, {
        customer_pan_number: customerPan,
        consent: 'Y',
        consent_text: "I hereby declare my consent agreement for fetching my information via ZOOP API."
    });
}

export async function verifyPanDemographicByZoop({ customerPan, customerDob, customerName }) {
    return makeZoopRequest(ZOOP_API_URLS.PAN_DEMOGRAPHIC, {
        customer_pan_number: customerPan,
        customer_dob: customerDob,
        user_name: customerName,
        consent: 'Y',
        consent_text: 'Approve the values here'
    });
}

export async function verifyDrivingLicenceAdvanceByZoop({ customerDLN, customerDob }) {
    return makeZoopRequest(ZOOP_API_URLS.DRIVING_LICENCE_ADVANCE, {
        customer_dl_number: customerDLN,
        customer_dob: customerDob,
        consent: "Y",
        consent_text: "I hereby declare my consent agreement for fetching my information via ZOOP API."
    });
}

export async function verifyPassportLiteByZoop({ customerPassportNumber, customerPassportType, customerExpiryDate, customerFirstName, customerLastName, customerDob, customerGender }) {
    return makeZoopRequest(ZOOP_API_URLS.PASSPORT_LITE, {
        customer_passport_number: customerPassportNumber,
        passport_type: customerPassportType,
        passport_expiry_date: customerExpiryDate,
        customer_first_name: customerFirstName,
        customer_last_name: customerLastName,
        customer_dob: customerDob,
        customer_gender: customerGender,
        customer_country: "IND",
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API"
    });
}

export async function verifyVoterAdvanceByZoop( documentDetails ) {
    const { customerEpic } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.EPIC, {
        customer_epic_number: customerEpic,
        consent: 'Y',
        consent_text: 'I hereby declare my consent agreement for fetching my information via ZOOP API.'
    });
}

export async function verifyCkycLiteByZoop({ customerPan, customerDob, customerMobile }) {
    return makeZoopRequest(ZOOP_API_URLS.CKYC_LITE, {
        mode: "sync",
        data: {
            customer_pan_number: customerPan,
            customer_dob: customerDob,
            customer_phone_number: customerMobile,
            consent: "Y",
            consent_text: "Approve the values here"
        }
    });
}

export async function verifyOkycLiteByZoop( documentDetails ) {
    const { customerAadhaar } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.OKYC_LITE, {
        customer_aadhaar_number: customerAadhaar,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API."
    });
}

export async function verifyOkycOtpLiteByZoop({ request_id, verifyOtp}) {
    return makeZoopRequest(ZOOP_API_URLS.OKYC_OTP_LITE, {
        request_id: request_id,
        otp: verifyOtp,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API."
    });
}

export async function verifyGstinLiteByZoop(documentDetails) {
    const { customerGstin } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.GSTIN_LITE, {
        business_gstin_number: customerGstin,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API"
    });
}

export async function verifyGstinAdvanceByZoop(documentDetails) {
    const { customerGstin } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.GSTIN_ADVANCE, {
        business_gstin_number: customerGstin,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API"
    });
}

export async function verifyBankAccountLiteByZoop({ customerAccountNumber, customerIfsc }) {
    return makeZoopRequest(ZOOP_API_URLS.BANK_VERIFICATION_LITE, {
        account_number: customerAccountNumber,
        ifsc: customerIfsc,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API"
    });
}

export async function verifyRcLiteByZoop(documentDetails) {
    const { customerRC } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.RC_LITE, {
        vehicle_registration_number: customerRC,
        consent: "Y",
        consent_text: "RC Lite is Verified by author"
    });
}

export async function verifyRcAdvanceByZoop(documentDetails) {
    const { customerRC } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.RC_ADVANCE, {
        vehicle_registration_number: customerRC,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API."
    });
}

export async function verifyIfscLiteByZoop(documentDetails) {
    const { customerIfsc } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.IFSC_LITE, {
        ifsc: customerIfsc,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API."
    });
}

export async function verifyOcrLiteByZoop({ customerCardFront, customerCardBack }) {
    return makeZoopRequest(ZOOP_API_URLS.OCR_LITE, {
        card_front_image: customerCardFront,
        card_back_image: customerCardBack,
        card_type: "Anyone mention on document.",
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API."
    });
}