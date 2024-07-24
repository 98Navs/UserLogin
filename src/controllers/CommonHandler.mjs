// src/controllers/CommonHandler.mjs
import bcrypt from 'bcrypt';

class CommonHandler {

    //Valid Inputs
    static validUserRoles = ['admin', 'user'];
    static validUserStatuses = ['Active', 'Deactive', 'Suspended'];
    
    //Valid Formats
    static async validateSixDigitIdFormat(id) { if (!/^[0-9]{6}$/.test(id)) { throw new ValidationError('Invalid 6 digit id format.'); } }

    static async validateEmailFormat(email) { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { throw new ValidationError('Invalid email format.'); } }

    static async validatePasswordFormat(password) { if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) { throw new ValidationError('Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.'); } }

    static async validateNameFormat(userName) { if (!/^[a-zA-Z\s ]{4,}$/.test(userName)) { throw new ValidationError('Invalid userName. Must be at least 4 characters and only letters.'); } }

    static async validateMobileFormat(mobile) { if (!/^\d{10}$/.test(mobile)) { throw new ValidationError('Invalid mobile number. Must be 10 digits.'); } }

    static async validateRole(role) { if (!CommonHandler.validUserRoles.includes(role)) { throw new ValidationError(`Role must be one of: ${CommonHandler.validUserRoles.join(', ')} without any space.`); } }

    static async validateStatus(status) { if (!CommonHandler.validUserStatuses.includes(status)) { throw new ValidationError(`Status must be one of: ${CommonHandler.validUserStatuses.join(', ')} without any space.`); } }

    static async validatePanCardFormat(panCardNumber) { if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panCardNumber)) { throw new ValidationError('Invalid PAN card number. Must be in the format of 5 letters, 4 digits, and 1 letter, all in capital letters.'); } }

    static async validateDrivingLicenseFormat(drivingLicenseNumber) { if (!/^([A-Z]{2}[0-9]{13})$/.test(drivingLicenseNumber)) { throw new ValidationError('Invalid driving license number. Must be in the format of 2 letters, 13 digits.'); } }

    static async validateVoterEpicFormat(customerEpic) { if (!/^([A-Z]{3}[0-9]{7})$/.test(customerEpic)) { throw new ValidationError('Invalid epic number. Must be in the format of 3 letters, 7 digits.'); } }

    static async validatePassportFormat(customerPassportNumber) { if (!/^([A-Z]{1}[0-9]{7})$/.test(customerPassportNumber)) { throw new ValidationError('Invalid passport number. Must be in the format of 1 letters, 7 digits.'); } }

    static async validateAadhaarFormat(customerAadhaar) { if (!/^([0-9]{12})$/.test(customerAadhaar)) { throw new ValidationError('Invalid aadhaar number. Must be in the format of 12 digits.'); } }

    //Password Hashing
    static async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    // Catching Errors
    static catchError(error, res) {
        try {
            if (error instanceof ValidationError) { res.status(400).json({ status: 400, success: false, message: error.message }); }
            else if (error instanceof ApiError) { res.status(401).json({ status: 401, success: false, message: error.message }); }
            else if (error instanceof MiddlewareError) { res.status(403).json({ status: 403, success: false, message: error.message }); }
            else if (error instanceof NotFoundError) { res.status(404).json({ status: 404, success: false, message: error.message }); }
            else { res.status(500).json({ status: 500, success: false, message: 'Internal server error.' }); }
        } catch (error) {
            res.status(500).json({ status: 500, success: false, message: 'Something unexpected has happened' });
        }
    }

    //Required Fields Validation
    static async validateRequiredFields(fields) {
        const missingFields = Object.entries(fields)
            .filter(([_, value]) => value === undefined || value === '')
            .map(([field]) => field.charAt(0).toUpperCase() + field.slice(1));
        if (missingFields.length > 0) { throw new NotFoundError(`Missing required fields: ${missingFields.join(', ')}`); }
    }
}

//Assigned Errors
class ValidationError extends Error { constructor(message) { super(message); this.name = 'ValidationError'; } }
class ApiError extends Error { constructor(message) { super(message); this.name = 'ApiError'; } }
class NotFoundError extends Error { constructor(message) { super(message); this.name = 'NotFoundError'; } }
class MiddlewareError extends Error { constructor(message) { super(message); this.name = 'MiddlewareError'; } }


export { CommonHandler, ValidationError, NotFoundError, MiddlewareError, ApiError };
