import express from 'express';
import Product from '../models/products.model.js';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const secret = process.env.PRIVATE_KEY;
const cokieName = process.env.JWT_COOKIE_NAME;


router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const product = await Product.findById(productId).lean();
    const userToken = req.cookies[cokieName];
    const decodedToken = jwt.verify(userToken, secret); 
    const user = decodedToken;
    if (product) {
        res.render('productsid', { product, user });
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

router.post('/', (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    res.redirect('/products');
});

Handlebars.registerHelper("ifEqual", function (a, b, options) {
    if (a === b) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


export default router
