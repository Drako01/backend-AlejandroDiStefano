import { Router } from 'express';
const router = Router();
import dotenv from 'dotenv';
dotenv.config();

const cokieName = process.env.JWT_COOKIE_NAME;
router.get('/', async (req, res) => {
    res.clearCookie(cokieName); 
    res.redirect('/');
});

export default router;

