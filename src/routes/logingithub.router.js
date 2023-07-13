import passport from 'passport';
import { Router } from 'express';
import jwt from 'jsonwebtoken';


const router = Router();
const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;


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
        res.redirect('/login');
    }
});

export default router;
