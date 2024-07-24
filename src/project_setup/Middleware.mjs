// src/project_setup/Middleware.mjs
import jwt from 'jsonwebtoken';
import { CommonHandler, MiddlewareError } from '../controllers/CommonHandler.mjs';

class Middleware {
    //Validate Authentiacation
    static async validateToken(req, res, next, roles, message) {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.jwt;
        if (!token) throw new MiddlewareError('Token not found in header or cookies');
        try {
            const decodedToken = jwt.verify(token, process.env.APP_SECRET);
            if (!decodedToken) { throw new MiddlewareError('Unauthorized or distorted token'); }
            if (roles && !roles.includes(decodedToken.role)) { return res.status(403).json({ status: 403, success: false, message }); }
            req.user = decodedToken;
            next();
        } catch (error) {
            CommonHandler.catchError(error, res);
        }
    }

    static optionalMiddleware(req, res, next) {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.jwt;
        try {
            if (token) {
                jwt.verify(token, process.env.APP_SECRET, (error, decodedToken) => {
                    if (!error) req.user = decodedToken;
                    else { throw new MiddlewareError('Unauthorized or distorted token'); }
                    next();
                });
            } else {
                next();
            }
        } catch(error) {
            CommonHandler.catchError(error, res);
        }
    }

    static validateRole(roles, message) { return (req, res, next) => Middleware.validateToken(req, res, next, roles, message); }

    //Generate JWT token 
    static async generateToken(payload, res) {
        try {
            const token = jwt.sign(payload, process.env.APP_SECRET, { expiresIn: '30d' });
            res.cookie('jwt', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
            return token;
        } catch (error) {
            throw new MiddlewareError('Error generating token');
        }
    }
}

//Validate Authorization
const roles = { admin: ['admin'], user: ['user', 'admin'] };
Middleware.admin = Middleware.validateRole(roles.admin, "NOT Authorized as user is Not Admin");
Middleware.user = Middleware.validateRole(roles.user, "Not Authorized as user");

export default Middleware;