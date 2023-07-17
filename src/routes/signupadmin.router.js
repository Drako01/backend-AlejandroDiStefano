import passport from 'passport';
import { Router } from 'express';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import loggers from '../server/logger.js'
const router = Router();


router.get('/', (req, res) => {
    const user = getUserFromToken(req);
    res.render('signupadmin', { user });
});

router.post('/', (req, res, next) => {
    passport.authenticate('signup', (err, user, info) => {
        if (err) {
            loggers.error(err);
            return res.status(500).send('Error de servidor');
        }

        if (!user) {
            if (info.message === 'Email already exists.') {
                return res.render('error/notSignupByEmail');
            } else if (info.message === 'Phone already exists.') {
                return res.render('error/notSignupByPhone');
            }
        }

        req.login(user, (err) => {
            if (err) {
                loggers.error(err);
                return res.status(500).send('Error de servidor');
            }

            res.redirect('/users');
        });
    })(req, res, next);
});

export default router
