     SERVICES = {
        PAN_LITE: 'PAN LITE',
        PAN_ADVANCE: 'PAN ADVANCE',
        PAN_DEMOGRAPHIC: 'PAN DEMOGRAPHIC',
        PAN_206AB: 'PAN 206AB',
        PAN_MICRO: 'PAN MICRO',
        PAN_PRO: 'PAN PRO',
        GST_PAN: 'GST PAN',
        GSTIN_LITE: 'GSTIN LITE',
        GSTIN_ADVANCE: 'GSTIN ADVANCE',
        
        PASSPORT_LITE: 'PASSPORT LITE',
        PASSPORT_ADVANCE: 'PASSPORT ADVANCE',
        
        CKYC_LITE: 'CKYC LITE',
        OKYC_LITE: 'OKYC LITE',

        BANK_VERIFICATION_LITE: 'BANK VERIFICATION LITE',
        IFSC_LITE: 'IFSC LITE',

        VOTER_ADVANCE: 'VOTER ADVANCE',
        DL_ADVANCE: 'DRIVING LICENCE ADVANCE',
        EPFO_PRO: 'EPFO PRO',
        CIN_ADVANCE: 'CIN ADVANCE',
        FSSAI: 'FSSAI',
        UDYOG_AADHAAR: 'UDYOG AADHAAR',
        CORPORATE_VERIFICATION: 'CORPORATE VERIFICATION',

        OCR_LITE: 'OCR LITE',
        CHEQUE_OCR: 'CHEQUE OCR',
        FACE_CROP: 'FACE CROP',
        FACE_MATCH: 'FACE MATCH',
        
        //RC_LITE: 'RC LITE',
        //RC_ADVANCE: 'RC ADVANCE',
        //EMAIL_VERIFICATION_REQUEST: 'EMAIL VERIFICATION REQUEST',
         //AADHAAR_ESIGN: "AADHAAR ESIGN",
    };

{
 {
        "packageName": "ADMIN PACKAGE",
        "packageLifeSpan": 365,
        "packageCharges": 5000,
        "status": "Active",
            "servicesProvided": [
                    {
                        "serviceType": "RC LITE",
                        "serviceCharge": 150,
                        "serviceUrl": "/verifyRcLite",
                        "status": "Active"
                    },

                    {
                        "serviceType": "AADHAAR ESIGN",
                        "serviceCharge": 200,
                        "serviceUrl": "/verifyAadhaarEsign",
                        "status": "Active"
                    },

                    {
                        "serviceType": "CHEQUE OCR",
                        "serviceCharge": 180,
                        "serviceUrl": "/verifyChequeOcr",
                        "status": "Active"
                    },
 



                    {
                        "serviceType": "EMAIL VERIFICATION REQUEST",
                        "serviceCharge": 130,
                        "serviceUrl": "/verifyEmailVerificationRequest",
                        "status": "Active"
                    },
                    {
                        "serviceType": "EMAIL VERIFICATION SUBMIT",
                        "serviceCharge": 140,
                        "serviceUrl": "/verifyEmailVerificationSubmit",
                        "status": "Active"
                    },

                    {
                        "serviceType": "FACE CROP",
                        "serviceCharge": 170,
                        "serviceUrl": "/verifyFaceCrop",
                        "status": "Active"
                    },
                    {
                        "serviceType": "FACE MATCH",
                        "serviceCharge": 190,
                        "serviceUrl": "/verifyFaceMatch",
                        "status": "Active"
                    },

                    {
                        "serviceType": "OCR LITE",
                        "serviceCharge": 160,
                        "serviceUrl": "/verifyOcrLite",
                        "status": "Active"
                    },



                    {
                        "serviceType": "RC ADVANCE",
                        "serviceCharge": 350,
                        "serviceUrl": "/verifyRcAdvance",
                        "status": "Active"
                    },


                ]
    }
}