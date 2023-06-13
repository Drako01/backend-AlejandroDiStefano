import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateToken } from './passport.js';
dotenv.config();

const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;

export function getUserFromToken(req) {
    try {
        if (!req.cookies || !req.cookies[cookieName]) {                        
            const token = generateToken('404');
            return token ;           
        }
        
        const userToken = req.cookies[cookieName];
        const decodedToken = jwt.verify(userToken, secret);
        return decodedToken;
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return null;
    }
}

export function getUserId(req) {
    try {
        const user = getUserFromToken(req);
        if (!user || !user.userId) {
            throw new Error('No se pudo obtener el ID de usuario del token');
        }
        return user.userId;
    } catch (error) {
        console.error('Error al obtener el ID de usuario:', error);
        return null;
    }
}
