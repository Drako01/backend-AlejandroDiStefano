import Product from '../models/products.model.js';
import Handlebars from 'handlebars';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import { Router } from 'express';
const router = Router();


router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const product = await Product.findById(productId).lean();
    const user = getUserFromToken(req);
    if (product) {
        res.render('productsid', { product, user });
    } else {
        res.status(404).render('error/error404');
    }
});

router.post('/', (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    res.redirect('/products');
});

Handlebars.registerHelper('ifEqual', (a, b, options) => {
    return a === b ? options.fn(this) : options.inverse(this);
});


export default router
