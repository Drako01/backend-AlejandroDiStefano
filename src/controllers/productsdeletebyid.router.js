import Product from '../models/products.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import loggers from '../server/logger.js'
import { Router } from 'express';
const router = Router();


router.get('/:id', isAdmin, async (req, res) => {
    const user = getUserFromToken(req)
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndRemove(productId).lean();

        if (product) {
            res.render('productsdeletebyid', { product, user });
        } else {
            res.status(404).render('error/error404', { user });
        }
    } catch (error) {
        loggers.error(error);
        res.status(500).render('error/notProduct' , { user })
    }
});


export default router
