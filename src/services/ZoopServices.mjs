//src/services/ZoopServices.mjs
import axios from 'axios';

const ZOOP_API_URLS = {
    PAN_LITE: 'https://test.zoop.one/api/v1/in/identity/pan/lite',
    PAN_ADVANCE: 'https://test.zoop.one/api/v1/in/identity/pan/advance',
    PAN_DEMOGRAPHIC: 'https://test.zoop.one/api/v1/in/identity/pan/demographic',
    VOTER_ADVANCE: 'https://test.zoop.one/api/v1/in/identity/voter/advance',
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
    OCR_LITE: 'https://test.zoop.one/api/v1/in/utility/ocr/lite',
    EPFO_PRO: 'https://test.zoop.one/api/v1/in/identity/epfo/pro',
    PAN_206AB: 'https://test.zoop.one/api/v1/in/identity/pan/206ab',
    PAN_MICRO: 'https://test.zoop.one/api/v1/in/identity/pan/micro',
    PAN_PRO: 'https://test.zoop.one/api/v1/in/identity/pan/pro',
    PASSPORT_ADVANCE: 'https://test.zoop.one/api/v1/in/identity/passport/advance',
    CIN_ADVANCE: 'https://test.zoop.one/api/v1/in/merchant/cin/advance',
    FSSAI: 'https://test.zoop.one/api/v1/in/merchant/fssai/number',
    GST_PAN: 'https://test.zoop.one/api/v1/in/merchant/gstpan/lite',
    UDYOG_AADHAAR: 'https://test.zoop.one/api/v1/in/merchant/udyog/lite',
    CORPORATE_VERIFICATION: 'https://test.zoop.one/api/v1/in/persona/corporate/verification',
    CHEQUE_OCR: 'https://test.zoop.one/api/v1/in/utility/ocr/cheque',
    EMAIL_VERIFICATION_REQUEST: 'https://test.zoop.one/api/v1/in/persona/email/verification/request',
    EMAIL_VERIFICATION_SUBMIT: 'https://test.zoop.one/api/v1/in/persona/email/verification/submit',
    AADHAAR_ESIGN: 'https://test.zoop.one/contract/esign//v5/init',
    OCR_SDK: 'https://test.zoop.one/ocr/v1/init',
    FACE_CROP: 'https://test.zoop.one/api/v1/in/ml/face/crop',
    FACE_MATCH: 'https://test.zoop.one/api/v1/in/ml/face/match'
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
    return makeZoopRequest(ZOOP_API_URLS.VOTER_ADVANCE, {
        customer_epic_number: customerEpic,
        consent: 'Y',
        consent_text: 'I hereby declare my consent agreement for fetching my information via ZOOP API.'
    });
}

export async function verifyCkycLiteByZoop({ customerPan, customerDob, customerMobile }) {
    return makeZoopRequest(ZOOP_API_URLS.CKYC_LITE, {
        customer_pan_number: customerPan,
        customer_dob: customerDob,
        customer_phone_number: customerMobile,
        consent: "Y",
        consent_text: "Approve the values here"
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

export async function verifyEpfoProByZoop(documentDetails) {
    const { customerMobile } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.EPFO_PRO, {
        customer_phone_number: customerMobile,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API"
    });
}

export async function verifyPan206AbByZoop(documentDetails) {
    const { customerPan } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.PAN_206AB, {
        customer_pan_number: customerPan,
        consent: 'Y',
        consent_text: 'I hereby declare my consent agreement for fetching my information via ZOOP API.'
    });
}

export async function verifyPanMicroByZoop({customerPan, customerPanDetails}) {
    return makeZoopRequest(ZOOP_API_URLS.PAN_MICRO, {
        customer_pan_number: customerPan,
        pan_details: customerPanDetails,
        consent: 'Y',
        consent_text: 'I hereby declare my consent agreement for fetching my information via ZOOP API.'
    });
}

export async function verifyPanProByZoop({ customerPan, customerName }) {
    return makeZoopRequest(ZOOP_API_URLS.PAN_PRO, {
        customer_pan_number: customerPan,
        pan_holder_name: customerName,
        consent: 'Y',
        consent_text: 'I hereby declare my consent agreement for fetching my information via ZOOP API.'
    });
}

export async function verifyPassportAdvanceByZoop({ customerfileNumber, customerName, customerDob }) {
    return makeZoopRequest(ZOOP_API_URLS.PASSPORT_ADVANCE, {
        customer_file_number: customerfileNumber,
        name_to_match: customerName,
        customer_dob: customerDob,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API"
    });
}

export async function verifyCinAdvanceByZoop(documentDetails) {
    const { customerCinNumber } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.CIN_ADVANCE, {
        cin_number: customerCinNumber,
        consent: 'Y',
        consent_text: 'I hereby declare my consent agreement for fetching my information via ZOOP API.'
    });
}

export async function verifyFssaiByZoop(documentDetails) {
    const { fssaiNumber } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.FSSAI, {
        fssai_number: fssaiNumber,
        consent: 'Y',
        consent_text: 'I hereby declare my consent agreement for fetching my information via ZOOP API.'
    });
}

export async function verifyGstPanByZoop(documentDetails) {
    const { customerGstPan } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.GST_PAN, {
        business_pan_number: customerGstPan,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API."
    });
}

export async function verifyUdyogAadhaarByZoop(documentDetails) {
    const { udyogAadhaar } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.UDYOG_AADHAAR, {
        udyog_aadhaar: udyogAadhaar,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API."
    });
}

export async function verifyCorporateVerificationByZoop(documentDetails) {
    const { customerNumber } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.CORPORATE_VERIFICATION, {
        customer_phone_number: customerNumber,
        consent: "Y",
        consent_text: "Approve the values here."
    });
}

export async function verifyChequeOcrByZoop(documentDetails) {
    const { chequeImage } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.CHEQUE_OCR, {
        cheque_image: chequeImage,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API"
    
    });
}

export async function verifyEmailVerificationRequestByZoop({ customerEmail, customerName }) {
    return makeZoopRequest(ZOOP_API_URLS.EMAIL_VERIFICATION_REQUEST, {
        email: customerEmail,
        name: customerName,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API"
    });
}

export async function verifyEmailVerificationSubmitByZoop({ request_id, verifyOtp }) {
    return makeZoopRequest(ZOOP_API_URLS.EMAIL_VERIFICATION_SUBMIT, {
        request_id: request_id,
        otp: verifyOtp,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API."
    });
}

export async function verifyAadhaarEsignByZoop( {document, signerName, signerEmail, signerLocation} ) {
    return makeZoopRequest(ZOOP_API_URLS.AADHAAR_ESIGN, {
        document: {
            name: "Agreement Esigning",
            data: document,
            info: "test"
        },
        signers: [
            {
                signer_name: signerName,
                signer_email: signerEmail,
                signer_city: signerLocation,
                signer_purpose: "Pdf viewer test",
                sign_coordinates: [
                    {
                        page_num: 0,
                        x_coord: 50,
                        y_coord: 250
                    }
                ]
            }
        ],
        txn_expiry_min: "10080",
        white_label: "Y",
        redirect_url: "https://esign.zoop.one",
        response_url: "https://esign.zoop.one",
        esign_type: "AADHAAR",
        email_template: {
            org_name: "Zoop.One"
        }
    });
}

export async function verifyFaceCropByZoop(documentDetails) {
    const { cardImage } = documentDetails;
    return makeZoopRequest(ZOOP_API_URLS.FACE_CROP, {
        card_image: cardImage,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API"

    });
}

export async function verifyFaceMatchByZoop({ cardImage, userImage }) {
    return makeZoopRequest(ZOOP_API_URLS.FACE_MATCH, {
        card_image: cardImage,
        user_image: userImage,
        consent: "Y",
        consent_text: "I hear by declare my consent agreement for fetching my information via ZOOP API."
    });
}