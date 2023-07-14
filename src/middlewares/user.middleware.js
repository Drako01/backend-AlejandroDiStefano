import jwt from 'jsonwebtoken';
import config from '../server/config.js';

// Variables de entorno
const secret = config.jwt.privateKey;
const cookieName = config.jwt.cookieName;

export function getUserFromToken(req) {
    try {
        if (!req.cookies || !req.cookies[cookieName]) {                        
            const user = null;
            return user ;           
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
