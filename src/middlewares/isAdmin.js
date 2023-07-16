import jwt from 'jsonwebtoken';
import config from '../server/config.js';
import loggers from '../server/logger.js'

const secret = config.jwt.privateKey;
const cookieName = config.jwt.cookieName;

const isAdmin = (req, res, next) => {
    const userToken = req.cookies[cookieName];

    if (!userToken) {
        res.render('notAuthorized');
        return;
    }

    try {
        const decodedToken = jwt.verify(userToken, secret);
        const user = decodedToken; 

        if (user.role === 'admin') {
            req.user = user; 
            next();
        } else {
            res.render('notAuthorized');
        }
    } catch (err) {
        loggers.error(err);
        res.render('notAuthorized');
    }
};

export default isAdmin;
