import Product from '../daos/models/products.model.js';
import isAdmin from '../middlewares/admin.middleware.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import loggers from '../server/logger.js'
import { Router } from 'express';
const router = Router();

router.get('/:pid', isAdmin, async (req, res) => {
    const productId = req.params.pid;
    const user = getUserFromToken(req);
    try {
        const producto = await Product.findById(productId).lean();
        if (producto) {
            res.render('productsedit', { producto, user});
        } else {
            res.status(404).render('error/error404', { user });
        }
    } catch (error) {
        loggers.error(error);
        res.status(500).render('error/notProduct' , { user })
    }
});


export default router