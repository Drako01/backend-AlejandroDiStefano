import jwt from 'jsonwebtoken';
import config from '../server/config.js';
import loggers from '../server/logger.js'

const secret = config.jwt.privateKey;
const cookieName = config.jwt.cookieName;

// Middleware para verificar si hay un usuario logueado
const isLoggedIn = (req, res, next) => {
    const userToken = req.cookies[cookieName];

    if (!userToken) {
        return res.redirect('/login');
    }

    try {
        const decodedToken = jwt.verify(userToken, secret);
        const user = decodedToken;

        if (user) {
            req.user = user;
            next();
        } else {
            return res.redirect('/login');
        }
    } catch (err) {
        loggers.error(err);
        return res.status(404).render('error/error404');
    }
};


export default isLoggedIn;
