import { Router } from 'express';
import Cart from '../models/carts.model.js';
import mongoose from 'mongoose';
import { getUserFromToken } from '../middlewares/user.middleware.js';


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
            return res.status(404).render('error/error404');
        }

        const itemIndex = cart.items.findIndex((item) => item._id.equals(itemId));
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();
        return res.render('cartsDeleteById', { cartId, itemId, user });
    } catch (error) {
        console.error(error);
        return res.status(500).render('notCart');
    }
});

export default router
