import passport from 'passport';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import loggers from '../config/logger.js'
import customError from '../services/error.log.js';
import customMessageSessions from '../services/sessions.log.js';

const router = Router();
const cookieName = config.jwt.cookieName;
const secret = config.jwt.privateKey;


router.get('/', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    try {
        const token = jwt.sign({ user: req.user }, secret);
        const user = req.user
        user.active = true;
        user.save();
        // Configurar la cookie con el token JWT
        res.cookie(cookieName, token, {
            httpOnly: true,
            secure: true,
        });
        
        customMessageSessions(`El Usuario ${req.user.first_name} con ID #${req.user._id} se ha Logueado con éxito.!`);
        res.redirect('/');
    } catch (err) {
        customError(err);
        loggers.error('Error al autenticar el usuario');
        res.redirect('/login');
    }
});

export default router;
