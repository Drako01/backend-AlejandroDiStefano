import passport from 'passport';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;


router.get('/', (req, res) => {
    const userToken = req.cookies[cookieName];
    const decodedToken = jwt.verify(userToken, secret); 
    const user = decodedToken;
    res.render('signupadmin', { user });
});

router.post('/', (req, res, next) => {
    passport.authenticate('signup', (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error de servidor');
        }

        if (!user) {
            if (info.message === 'Email already exists.') {
                return res.redirect('/notSignupByEmail');
            } else if (info.message === 'Phone already exists.') {
                return res.render('notSignupByPhone');
            }
        }

        req.login(user, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error de servidor');
            }

            res.redirect('/users');
        });
    })(req, res, next);
});

export default router
