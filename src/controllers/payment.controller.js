import Stripe from 'stripe';
import config from '../config/config.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import { CartService } from '../repositories/index.js';
import loggers from '../config/logger.js'
import customError from '../services/error.log.js';

const stripe = new Stripe(config.stripe.secretKey);

export const createSession = async (req, res) => {
    try {
        const user = getUserFromToken(req);
        const cartId = req.body.cartId;
        const isPremium = user.premium || (user.user && user.user.premium) || false;
        const discountMultiplier = isPremium ? 0.8 : 1;
        const cart = await CartService.getCartByUserId(cartId);

        if (!cart) {
            return res.status(404).render('error/error404', { user });
        }

        const lineItems = cart.items.map(item => ({
            price_data: {
                product_data: {
                    name: item.producto.title,
                    description: item.producto.description
                },
                currency: 'usd',
                unit_amount: Math.round(item.producto.price * 100 * discountMultiplier),
            },
            quantity: item.cantidad,
        }));

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:8080/api/success',
            cancel_url: 'http://localhost:8080/api/cancel',
        });

        return res.json(session);
    } catch (error) {
        customError(error);
        loggers.error(`Error al obtener los datos solicitados de la base de datos`);
        res.status(500).render('error/error500', { user });
    }
};
