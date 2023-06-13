import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;

export function getUserFromToken(req) {
    try {
        const userToken = req.cookies[cookieName];
        if (!userToken) {
            return res.status(403).render('notAuthorized');
        }
        const user = jwt.verify(userToken, secret);
        return user;
    } catch (error) {
        throw new Error('Error al verificar el token');
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
        throw new Error('Error al obtener el ID de usuario');
    }
}
