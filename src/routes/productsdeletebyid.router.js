import express from 'express';
import Product from '../models/products.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const secret = process.env.PRIVATE_KEY;
const cokieName = process.env.JWT_COOKIE_NAME;


router.get('/:id', isAdmin, async (req, res) => {
    const userToken = req.cookies[cokieName];
    const decodedToken = jwt.verify(userToken, secret); 
    const user = decodedToken;
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndRemove(productId).lean();

        if (product) {
            res.render('productsdeletebyid', { product, user });
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.sendStatus(500);
    }
});

export default router

