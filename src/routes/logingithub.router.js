import passport from 'passport';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import config from '../server/config.js';
import loggers from '../server/logger.js'

const router = Router();
const cookieName = config.jwt.cookieName;
const secret = config.jwt.privateKey;


router.get('/', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    try {
        const token = jwt.sign({ user: req.user }, secret);

        // Configurar la cookie con el token JWT
        res.cookie(cookieName, token, {
            httpOnly: true,
            secure: true,
        });

        res.redirect('/');
    } catch (err) {
        loggers.error(err);
        res.redirect('/login');
    }
});

export default router;
