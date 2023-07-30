import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import loggers from '../config/logger.js'
import customError from '../services/error.log.js';

const secret = config.jwt.privateKey;
const cookieName = config.jwt.cookieName;

const isAdmin = (req, res, next) => {
    const userToken = req.cookies[cookieName];

    if (!userToken) {
        res.render('error/notAuthorized');
        return;
    }

    try {
        const decodedToken = jwt.verify(userToken, secret);
        const user = decodedToken; 

        if (user.role === 'admin') {
            req.user = user; 
            next();
        } else {
            res.render('error/notAuthorized');
        }
    } catch (error) {
        customError(error);
        loggers.error('Error en la verificación del token');
        res.render('error/notAuthorized');
    }
};

export default isAdmin;
