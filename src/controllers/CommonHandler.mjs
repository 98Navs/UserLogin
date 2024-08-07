// src/controllers/CommonHandler.mjs
import bcrypt from 'bcrypt';

class CommonHandler {

    //Valid Inputs
    static validUserRoles = ['admin', 'user'];
    static validStatuses = ['Active', 'Deactive'];
    static validUserStatuses = ['Active', 'Deactive', 'Suspended'];
    static validPaymentStatuses = ['Approved', 'Pending', 'Rejected'];


    //Valid Formats
    static async validateSixDigitIdFormat(id) { if (!/^[0-9]{6}$/.test(id)) { throw new ValidationError('Invalid 6 digit id format.'); } }

    static async validateEmailFormat(email) { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { throw new ValidationError('Invalid email format.'); } }

    static async validatePasswordFormat(password) { if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) { throw new ValidationError('Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.'); } }

    static async validateNameFormat(userName) { if (!/^[a-zA-Z\s ]{4,}$/.test(userName)) { throw new ValidationError('Invalid userName. Must be at least 4 characters and only letters.'); } }

    static async validateMobileFormat(mobile) { if (!/^\d{10}$/.test(mobile)) { throw new ValidationError('Invalid mobile number. Must be 10 digits.'); } }

    static async validatePinCodeFormat(pinCode) { if (!/^\d{6}$/.test(pinCode)) { throw new ValidationError('Invalid pin code. Must be of 6 digits.'); } }

    static async validateRole(role) { if (!CommonHandler.validUserRoles.includes(role)) { throw new ValidationError(`Role must be one of: ${CommonHandler.validUserRoles.join(', ')} without any space.`); } }

    static async validateStatus(status) { if (!CommonHandler.validUserStatuses.includes(status)) { throw new ValidationError(`Status must be one of: ${CommonHandler.validUserStatuses.join(', ')} without any space.`); } }

    static async validateAccountNumberFormat(accountNumber) { if (!/^\d+$/.test(accountNumber)) { throw new ValidationError('Invalid account number. Must be a number.'); } }

    static async validateIfscCodeFormat(ifscCode) { if (!/^[a-zA-Z]{4}0[a-zA-Z0-9]{6}$/.test(ifscCode)) { throw new ValidationError('Invalid IFSC code. Must be in the format of 4 letters followed by 0 and 6 alphanumeric characters in capital letters.'); } }

    static async validateUpiIdFormat(upiId) { if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) { throw new ValidationError('Invalid UPI ID format.'); } }

    static async validateSaveAsFormat(saveAs) { if (!/^[a-zA-Z0-9\s]{1,}$/.test(saveAs)) { throw new ValidationError('Invalid saveAs. Must be at least 1 characters and only letters numbers and spaces.'); } }

    static async validatePanCardFormat(panCardNumber) { if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panCardNumber)) { throw new ValidationError('Invalid PAN card number. Must be in the format of 5 letters, 4 digits, and 1 letter, all in capital letters.'); } }

    static async validateGstNumberFormat(gstNumber) { if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(gstNumber)) { throw new ValidationError('Invalid GST number. Must be in the format of 2 digits, 5 letters, 4 digits, 1 letter, 1 alphanumeric character, "Z", and 1 alphanumeric character.'); } }

    static async validateDrivingLicenseFormat(drivingLicenseNumber) { if (!/^([A-Z]{2}[0-9]{13})$/.test(drivingLicenseNumber)) { throw new ValidationError('Invalid driving license number. Must be in the format of 2 letters, 13 digits.'); } }

    static async validateVoterEpicFormat(customerEpic) { if (!/^([A-Z]{3}[0-9]{7})$/.test(customerEpic)) { throw new ValidationError('Invalid epic number. Must be in the format of 3 letters, 7 digits.'); } }

    static async validatePassportFormat(customerPassportNumber) { if (!/^([A-Z]{1}[0-9]{7})$/.test(customerPassportNumber)) { throw new ValidationError('Invalid passport number. Must be in the format of 1 letters, 7 digits.'); } }

    static async validateAadhaarFormat(customerAadhaar) { if (!/^([0-9]{12})$/.test(customerAadhaar)) { throw new ValidationError('Invalid aadhaar number. Must be in the format of 12 digits.'); } }

    static async validatePaymentStatus(status) { if (!CommonHandler.validPaymentStatuses.includes(status)) { throw new ValidationError(`Status must be one of: ${CommonHandler.validPaymentStatuses.join(', ')} without any space.`); } }

    static async validateTransactionFormat(transactionNo) { if (!/^[a-zA-Z0-9]{6,20}$/.test(transactionNo)) { throw new ValidationError('Invalid transaction number. Must be between 6 to 20 characters and only alphanumeric.'); } }


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

    // Function to handle circular references
    static async safeStringify(obj) {
        const seen = new WeakSet();
        return JSON.stringify(obj, (key, value) => (typeof value === "object" && value !== null ? seen.has(value) ? undefined : (seen.add(value), value) : value));
    }

    static STATES_AND_UTS = [ "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal" ];

    static DISTRICTS = {
        "Andaman and Nicobar Islands": [ "North and Middle Andaman", "South Andaman", "Nicobar" ],
        "Andhra Pradesh": [ "Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "West Godavari", "Y.S.R. Kadapa" ],
        "Arunachal Pradesh": [ "Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Siang", "Upper Dibang Valley", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang" ],
        "Assam": [ "Baksa", "Barpeta", "Bongaigaon", "Cachar", "Chirang", "Darrang", "Dhemaji", "Dibrugarh", "Diphu", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "Tinsukia", "Udalguri" ],
        "Bihar": [ "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran" ],
        "Chandigarh": [ "Chandigarh" ],
        "Chhattisgarh": [ "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Korea", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja" ],
        "Dadra and Nagar Haveli and Daman and Diu": [ "Dadra and Nagar Haveli", "Daman", "Diu" ],
        "Delhi": [ "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "South Delhi", "South East Delhi", "South West Delhi", "Shahdara", "West Delhi" ],
        "Goa": [ "North Goa", "South Goa" ],
        "Gujarat": [ "Ahmedabad", "Amreli", "Anand", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kutch", "Mahisagar", "Mehsana", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Surat", "Tapi", "Vadodara", "Valsad" ],
        "Haryana": [ "Ambala", "Bhiwani", "Chandigarh", "Faridabad", "Fatehabad", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Tarn Taran" ],
        "Himachal Pradesh": [ "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Mandi", "Shimla", "Sirmaur", "Solan", "Una" ],
        "Jharkhand": [ "Bokaro", "Chatra", "Deoghar", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Kishanganj", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran" ],
        "Karnataka": [ "Bagalkot", "Bangalore Rural", "Bangalore Urban", "Belagavi", "Ballari", "Bidar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davangere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttar Kannada", "Yadgir" ],
        "Kerala": [ "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasargod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thrissur", "Wayanad" ],
        "Ladakh": [ "Leh", "Kargil" ],
        "Lakshadweep": [ "Kavaratti", "Agatti", "Amini", "Androth", "Bangaram", "Kalapeni", "Maliku", "Minicoy", "Suheli" ],
        "Madhya Pradesh": [ "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha" ],
        "Maharashtra": [ "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Bhilwara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal" ],
        "Manipur": [ "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kangpokpi", "Noney", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul" ],
        "Meghalaya": [ "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills" ],
        "Mizoram": [ "Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Mamit", "Saiha", "Serchhip" ],
        "Nagaland": [ "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto" ],
        "Odisha": [ "Angul", "Bargarh", "Baudh", "Balangir", "Balasore", "Baleswar", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khurda", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh" ],
        "Puducherry": [ "Puducherry", "Karaikal", "Mahe", "Yanam" ],
        "Punjab": [ "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fatehbad", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Tarn Taran" ],
        "Rajasthan": [ "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Rajsamand", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur" ],
        "Sikkim": [ "East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim" ],
        "Tamil Nadu": [ "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Tiruchirapalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Vellore", "Villupuram", "Virudhunagar" ],
        "Telangana": [ "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalapally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Warangal (Rural)", "Warangal (Urban)", "Yadadri Bhuvanagiri" ],
        "Tripura": [ "Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura" ],
        "Uttar Pradesh": [ "Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Auraiya", "Ayodhya", "Azamgarh", "Badaun", "Bagpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaloun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sant Kabir Nagar", "Sant Ravidas Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi" ],
        "Uttarakhand": [ "Almora", "Bageshwar", "Baijnath", "Champawat", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi" ],
        "West Bengal": [ "Alipurduar", "Bankura", "Bardhaman", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Purba Bardhaman", "Purulia", "South 24 Parganas", "Uttar Dinajpur" ]
    };

}

//Assigned Errors
class ValidationError extends Error { constructor(message) { super(message); this.name = 'ValidationError'; } }
class ApiError extends Error { constructor(message) { super(message); this.name = 'ApiError'; } }
class NotFoundError extends Error { constructor(message) { super(message); this.name = 'NotFoundError'; } }
class MiddlewareError extends Error { constructor(message) { super(message); this.name = 'MiddlewareError'; } }

export { CommonHandler, ValidationError, NotFoundError, MiddlewareError, ApiError };