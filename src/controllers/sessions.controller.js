import { UserService } from '../repositories/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken } from '../middlewares/passport.middleware.js';
import config from '../config/config.js';
import loggers from '../config/logger.js'
import passport from 'passport';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import customError from '../services/error.log.js';
import customMessageSessions from '../services/sessions.log.js';
import { sendWellcomeUser } from '../helpers/nodemailer.helpers.js';


const cookieName = config.jwt.cookieName;
const secret = config.jwt.privateKey;

export const getUserFromCookiesController = async (req, res) => { // DAO Aplicado
    const userToken = req.cookies[cookieName];

    if (!userToken) {
        return res.status(401).render('error/notLoggedIn');
    }

    try {
        const decodedToken = jwt.verify(userToken, cookieName);
        const userId = decodedToken.userId;
        UserService.getById(userId, (err, user) => {
            if (err || !user) {
                return res.status(404).render('error/error404');
            }

            return res.status(200).redirect('/');
        });
    } catch (err) {
        customError(err);
        loggers.error('Error to get user from cookies');
        return res.status(500).render('error/error500');
    }
};

export const getLogginController = async (req, res) => {
    res.render('login');
};

export const sendLogginController = async (req, res) => { // DAO Aplicado
    const { email, password } = req.body;

    try {
        const user = await UserService.getOne({ email: email });

        if (!user) {
            return res.status(401).render('error/notLoggedIn');
        }

        bcrypt.compare(password, user.password)
            .then(result => {
                if (result) {
                    user.active = true;
                    user.save();
                    const token = generateToken(user);
                    const userToken = token;
                    const decodedToken = jwt.verify(userToken, secret);
                    const userId = decodedToken.userId;
                    const message = `El Usuario ${decodedToken.first_name} ${decodedToken.last_name} con ID  #${userId} se ha Logueado con éxito.!`;
                    customMessageSessions(message)

                    res.cookie(cookieName, userToken).redirect('/');
                } else {
                    loggers.error('Error to login user');
                    return res.status(401).render('error/notLoggedIn');
                }
            })
    } catch (err) {
        customError(err);
        loggers.error('Error to login user');
        return res.status(500).render('error/error500');
    }
};

export const getLogoutController = async (req, res) => {
    const user = getUserFromToken(req);

    const firstName = user?.first_name || user?.user?.first_name;
    const lastName = user?.last_name || user?.user?.last_name;
    const userId = user?.userId || user?.user?._id;

    const message = `El Usuario ${firstName} ${lastName} con ID #${userId} se ha Deslogueado con éxito.!`;
    customMessageSessions(message);

    try {
        await UserService.update(userId, { active: false });
        res.clearCookie(cookieName);
        res.redirect('/');
    } catch (err) {
        customError(err);
        loggers.error('Error to update user status to inactive');
        return res.status(500).render('error/error500');
    }
}

export const getSignupController = async (req, res) => {
    res.render('signup');
}

export const setSignupController = async (req, res, next) => {
    passport.authenticate('signup', (err, user, info) => {
        if (err) {
            customError(err);
            loggers.error(err);
            return res.status(403).render('error/error403');
        }

        if (!user) {
            if (info.message === 'Email already exists.') {
                return res.render('error/notSignupByEmail');
            } else if (info.message === 'Phone already exists.') {
                return res.render('error/notSignupByPhone');
            }
        }

        req.login(user, async (err) => {
            if (err) {
                customError(err);
                loggers.error(err);
                return res.status(403).render('error/error403');
            }
            try {
                await sendWellcomeUser(user.email);
            } catch (err) {
                customError(err);
                loggers.error('Error sending welcome email');
            }
            res.redirect('/login');
        });
    })(req, res, next);
}

export const getSignupAdminController = (req, res) => {
    const user = getUserFromToken(req);
    res.render('signupadmin', { user });
}

export const setSignupAdminController = (req, res, next) => {
    passport.authenticate('signup', (err, user, info) => {
        if (err) {
            customError(err);
            loggers.error('Error creating user');
            return res.status(403).render('error/error403')
        }

        if (!user) {
            if (info.message === 'Email already exists.') {
                return res.render('error/notSignupByEmail');
            } else if (info.message === 'Phone already exists.') {
                return res.render('error/notSignupByPhone');
            }
        }

        req.login(user, async (err) => {
            if (err) {
                customError(err);
                loggers.error('Error creating user');
                return res.status(403).render('error/error403')
            }
            try {
                await sendWellcomeUser(user.email);

            } catch (err) {
                customError(err);
                loggers.error('Error sending welcome email', err);
            }
            res.redirect('/users');
        });
    })(req, res, next);
}


