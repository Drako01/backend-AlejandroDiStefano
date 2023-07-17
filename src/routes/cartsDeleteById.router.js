import { Router } from 'express';
import Cart from '../models/carts.model.js';
import mongoose from 'mongoose';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import loggers from '../server/logger.js'

const router = Router();

router.get('/:cartId/:itemId', async (req, res) => {    
    const user = getUserFromToken(req);
    const { cartId, itemId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).json({ error: 'ID de carrito inválido' });
    }

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).render('error/error404', { user });
        }

        const itemIndex = cart.items.findIndex((item) => item._id.equals(itemId));
        if (itemIndex === -1) {
            return res.status(404).render('error/notCartProducts', { cartId, itemId, user });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();
        return res.render('cartsDeleteById', { cartId, itemId, user });
    } catch (error) {
        loggers.error(error);
        return res.status(500).render('error/notCart');
    }
});

export default router
