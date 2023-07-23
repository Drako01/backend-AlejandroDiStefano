import { Router } from 'express';
import config from '../config/config.js';

const router = Router();
const cookieName = config.jwt.cookieName;

router.get('/', async (req, res) => {
    res.clearCookie(cookieName); 
    res.redirect('/');
});

export default router;

