import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import loggers from '../config/logger.js'
import customError from '../services/error.log.js';

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
        customError(error);
        loggers.error('Error al verificar el token');
        return null;
    }
}

export function getUserId(req) {
    try {
        const user = getUserFromToken(req);
        if (!user || !user.userId) {
            loggers.error('No se pudo obtener el ID de usuario del token');
        }
        return user.userId;
    } catch (error) {
        customError(error);
        loggers.error('Error al obtener el ID de usuario');
        return null;
    }
}
