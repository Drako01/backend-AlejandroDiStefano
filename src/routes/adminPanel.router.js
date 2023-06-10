import { Router } from 'express';
import Product from '../models/products.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;

router.get('/', async (req, res) => {
    const products = await Product.find().lean();
    const userToken = req.cookies[cookieName];

    if (!userToken) {
        return res.status(403).render('notAuthorized');
    }

    try {
        const decodedToken = jwt.verify(userToken, secret);
        const user = decodedToken;
        if (user.role !== 'admin') {
            return res.status(403).render('notAuthorized');
        }
        res.status(200).render('admin_panel', { products, user });
    } catch (error) {
        return res.status(403).render('notAuthorized');
    }
});

export default router;
