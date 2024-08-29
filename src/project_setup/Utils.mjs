//src/project_setup/Utils.mjs
import nodemailer from 'nodemailer';

//Pagination
export const paginate = async (model, query, page, limit, req, sort = { updatedAt: -1 }) => {
    const skip = (page - 1) * limit;
    const [data, totalDocuments] = await Promise.all([model.find(query).sort(sort).skip(skip).limit(limit).exec(), model.countDocuments(query)]);
    const pages = !limit ? 0 :  Math.ceil(totalDocuments / limit);
    const nextPageUrl = page < pages ? `${req.baseUrl}${req.path}?pageNumber=${page + 1}&perpage=${limit}` : "";
    return { data, totalDocuments, currentPage: page, totalPages: pages, nextPageUrl, perPage: limit };
};

//Email handler
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: 'navdeep@scriza.in', pass: 'bqofhxylqvkspers' }
});

export const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({ from: 'admin@scriza.in', to, subject, text });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email.');
    }
};