import Product from '../models/products.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
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
            res.status(404).render('error/error404');
        }
    } catch (error) {
        res.status(500).send('Error al obtener información del producto');
    }
});


export default router
