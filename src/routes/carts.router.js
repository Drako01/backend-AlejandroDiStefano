import { Router } from 'express';
import Product from '../models/products.model.js';
import Cart from '../models/carts.model.js';
import Handlebars from 'handlebars';
import Swal from 'sweetalert2';
import mongoose from 'mongoose';
import { getUserFromToken } from '../middlewares/user.middleware.js';

import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const cokieName = process.env.JWT_COOKIE_NAME;
let user = null;
let userEmail = null;

Handlebars.registerHelper('reduce', function (array, prop) {
    return array.reduce((acc, item) => acc + item[prop], 0);
});
Handlebars.registerHelper('multiply', function (a, b) {
    return a * b;
});
Handlebars.noEscape = true;

async function getOrCreateCart(userEmail = null) {
    if (userEmail) {
        const cart = await Cart.findOne({ 'user.email': userEmail }).exec();
        if (cart) {
            return cart;
        } else {
            const newCart = new Cart({ user: { email: userEmail }, items: [] });
            return newCart.save();
        }
    } else {
        const cart = await Cart.findOne({ 'user.email': null }).exec();
        if (cart) {
            return cart;
        } else {
            const newCart = new Cart({ items: [] });
            return newCart.save();
        }
    }
}

// Visualizar el Carrito
router.get('/', async (req, res) => {
    try {
        const { sortOption } = req.query;
        const userToken = req.cookies[cokieName];


        if (userToken) {
            user = getUserFromToken(req);
            userEmail = user.email || user.user.email;
        } else {
            return res.render('login');
        }

        let cart;
        if (userEmail) {
            cart = await getOrCreateCart(userEmail);
        } else {
            cart = await getOrCreateCart();
        }

        if (!cart || cart.items.length === 0 || (!userEmail && cart.user.email)) {
            return res.render('notCart');
        }
        const cartId = cart._id.toString();

        let sortedItems = [...cart.items];

        if (sortOption === 'asc') {
            sortedItems.sort((a, b) => a.producto.price - b.producto.price);
        } else if (sortOption === 'desc') {
            sortedItems.sort((a, b) => b.producto.price - a.producto.price);
        }

        const totalPriceAggregate = await Cart.aggregate([
            { $match: { _id: cart._id } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.producto',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$_id',
                    totalPrice: {
                        $sum: { $multiply: ['$product.price', '$items.cantidad'] },
                    },
                },
            },
        ]);

        const totalPrice = totalPriceAggregate.length > 0 ? totalPriceAggregate[0].totalPrice : 0;

        res.render('carts', { cart: { ...cart, items: sortedItems }, totalPrice, cartId, user });
    } catch (err) {
        console.error(err);
        res.status(500).render('notCart');
    }
});

// Vaciar el carrito por su ID
router.post('/:cartId/vaciar', async (req, res) => {
    const userToken = req.cookies[cokieName];

    if (userToken) {
        user = getUserFromToken(req)
        userEmail = user.email || user.user.email;
    }
    try {
        const cartId = req.params.cartId;
        const cart = await Cart.findOneAndUpdate(
            { _id: cartId, 'user.email': userEmail },
            { items: [] }
        );

        if (!cart) {
            return res.redirect('/');
        }

        cart.items = [];
        await cart.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al vaciar el carrito');
    }
});

// Eliminar el carrito de la base de datos
router.post('/:cartId/eliminar', async (req, res) => {
    const userToken = req.cookies[cokieName];

    if (userToken) {
        user = getUserFromToken(req);
        userEmail = user.email || user.user.email;
    }

    try {
        const cartId = req.params.cartId;
        const result = await Cart.deleteOne({ _id: cartId, 'user.email': userEmail });

        if (result.deletedCount === 0) {
            return res.redirect('/');
        }

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al vaciar el carrito');
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/:cartId/:itemId', async (req, res) => {
    const userToken = req.cookies[cokieName];

    if (userToken) {
        user = getUserFromToken(req);
        userEmail = user.email || user.user.email;
    }

    try {
        const cartId = req.params.cartId;
        const itemId = req.params.itemId;
        const { cantidad } = req.body;

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.redirect('/');
        }

        const cart = await Cart.findOneAndUpdate(
            { _id: cartId, 'user.email': userEmail, 'items._id': itemId },
            { $set: { 'items.$.cantidad': cantidad } },
            { new: true }
        );

        if (!cart) {
            return res.redirect('/');
        }

        res.redirect('/carts');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar la cantidad del producto');
    }
});

// Agregar productos al carrito
router.post('/:pid', async (req, res) => {
    try {
        const userToken = req.cookies[cokieName];

        if (userToken) {
            user = getUserFromToken(req);
            userEmail = user.email || user.user.email;
        }
        const { cantidad } = req.body;
        const productId = req.params.pid;
        const producto = await Product.findOne({ _id: productId });

        if (!userEmail) {
            return res.status(500).redirect('/login');            
        }

        let cart = await getOrCreateCart(userEmail);
        cart.items.push({ producto: producto, cantidad: cantidad });
        cart.user.email = userEmail;
        await cart.save();
        res.redirect('/');

    } catch (err) {
        res.status(500).redirect('/login');
    }
});

export default router;
