import express from 'express';
import Product from '../models/products.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const secret = process.env.PRIVATE_KEY;
const cokieName = process.env.JWT_COOKIE_NAME;

router.get('/:pid', isAdmin, async (req, res) => {
    const productId = req.params.pid;
    const userToken = req.cookies[cokieName];
    const decodedToken = jwt.verify(userToken, secret); 
    const user = decodedToken;
    try {
        const producto = await Product.findById(productId).lean();
        if (producto) {
            res.render('productsedit', { producto, user});
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al obtener información del producto');
    }
});


export default router
