import Cart from '../daos/models/carts.model.js';
import { ProductService, CartService } from '../repositories/index.js';
import mongoose from 'mongoose';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import shortid from 'shortid';
import config from '../config/config.js';
import loggers from '../config/logger.js'
import customError from '../services/error.log.js';

const cokieName = config.jwt.cookieName;
let user = null;
let userEmail = null;


export async function getOrCreateCart(userEmail = null) { // DAO Aplicado
    if (userEmail) {
        const cart = await CartService.getOne({ 'user.email': userEmail })
        if (cart) {
            return cart;
        } else {
            const newCart = new Cart({ user: { email: userEmail }, items: [], purchase_datetime: new Date(), code: shortid.generate() });
            return newCart.save();
        }
    } else {
        const cart = await CartService.getOne({ 'user.email': null }).exec();
        if (cart) {
            return cart;
        } else {
            const newCart = new Cart({ items: [], purchase_datetime: new Date(), code: shortid.generate() });
            return newCart.save();
        }
    }
}

// Visualizar el Carrito
export const createCartController = async (req, res) => { // DAO Aplicado

    try {
        const user = getUserFromToken(req);
        if (!user) {
            return res.redirect('/login');
        }

        const { sortOption } = req.query;
        const userToken = req.cookies[cokieName];

        const isPremium = user.premium || (user.user && user.user.premium) || false;
        const discountMultiplier = isPremium ? 0.8 : 1;

        let userEmail = user.email || (user.user && user.user.email) || '';
        if (!userToken) {
            return res.redirect('/login');
        }

        let cart;
        if (userEmail) {
            cart = await getOrCreateCart(userEmail);
        } else {
            cart = await getOrCreateCart();
        }
        if (!cart || cart.items.length === 0 || (!userEmail && cart.user.email)) {
            return res.render('error/notCart', { user });
        }
        const cartId = cart._id.toString();

        let sortedItems = [...cart.items];

        if (sortOption === 'asc') {
            sortedItems.sort((a, b) => a.producto.price - b.producto.price);
        } else if (sortOption === 'desc') {
            sortedItems.sort((a, b) => b.producto.price - a.producto.price);
        }

        const totalPriceAggregate = await CartService.setCart([
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

        const subTotal = totalPriceAggregate.length > 0 ? totalPriceAggregate[0].totalPrice : 0;
        const totalPrice = (subTotal * discountMultiplier).toFixed(2);

        res.render('carts', { cart: { ...cart, items: sortedItems }, totalPrice, cartId, user });

    } catch (error) {
        customError(error);
        loggers.error("El carrito no fue encontrado");
        res.status(500).render('error/notCart', { user });
    }
};

// Vaciar el carrito por su ID
export const clearCartByid = async (req, res) => { // DAO Aplicado
    const userToken = req.cookies[cokieName];

    if (userToken) {
        user = getUserFromToken(req)
        userEmail = user.email || user.user.email;
    }
    try {
        const cartId = req.params.cartId;
        const cart = await CartService.update(
            { _id: cartId, 'user.email': userEmail },
            { items: [] }
        );

        if (!cart) {
            return res.redirect('/');
        }

        cart.items = [];
        await cart.save();
        res.redirect('/');
    } catch (error) {
        customError(error);
        loggers.error("Error al vaciar el carrito");
        res.status(500).render('error/notCart', { user });
    }
};

// Eliminar el carrito de la base de datos
export const deleteCartById = async (req, res) => { // DAO Aplicado
    const userToken = req.cookies[cokieName];

    if (userToken) {
        user = getUserFromToken(req);
        userEmail = user.email || user.user.email;
    }

    try {
        const cartId = req.params.cartId;
        const result = await CartService.delete({ _id: cartId, 'user.email': userEmail });

        if (result.deletedCount === 0) {
            return res.redirect('/');
        }

        res.redirect('/');
    } catch (error) {
        customError(error);
        loggers.error("Error al eliminar el carrito");
        res.status(500).render('error/notCart', { user });
    }
};

// Actualizar la cantidad de un producto en el carrito
export const updateProductsToCartById = async (req, res) => { // DAO Aplicado
    const userToken = req.cookies[cokieName];
    
    const user = getUserFromToken(req);
    const userEmail = user.email || user.user.email;
    
    if (!userToken) {
        return res.redirect('/login');
    }

    try {
        const { cartId, itemId } = req.params;
        const { cantidad } = req.body;

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.redirect('/');
        }

        // Fetch the cart from the database
        const cart = await CartService.getOnePopulate(
            { _id: cartId, 'user.email': userEmail }
        );

        if (!cart) {
            return res.redirect('/');
        }

        // Construct updatedItemsArray as shown in your previous code
        const updatedItemsArray = cart.items.map(item => {
            if (item._id.toString() === itemId) {
                return {
                    ...item,
                    cantidad: cantidad
                };
            }
            return item;
        });

        // Update the cart's items with the updated array
        cart.items = updatedItemsArray;

        // Save the updated cart
        await cart.save();

        res.redirect('/carts');

    } catch (error) {
        customError(error);
        loggers.error("Error al actualizar la cantidad del producto en el Carrito", error);
        res.status(500).render('error/notCart', { user });
    }
};

// Agregar productos al carrito
export const addProductToCartController = async (req, res) => { // DAO Aplicado
    try {
        const userToken = req.cookies[cokieName];

        if (userToken) {
            user = getUserFromToken(req);
            userEmail = user.email || user.user.email;
        }
        const { cantidad } = req.body;
        const productId = req.params.pid;
        const producto = await ProductService.getOne({ _id: productId });

        if (!userEmail) {
            loggers.error('Usted no está logueado, por favor inicie sesión');
            return res.status(500).redirect('/login');
        }

        let cart = await getOrCreateCart(userEmail);

        const existingCartItem = cart.items.find(item => item.producto._id.toString() === productId);

        if (existingCartItem) {
            existingCartItem.cantidad += parseInt(cantidad);
        } else {
            cart.items.push({ producto: producto, cantidad: parseInt(cantidad) });
        }

        cart.user.email = userEmail;
        cart.code = shortid.generate();
        cart.purchase_datetime = new Date();
        await cart.save();
        res.redirect('/');

    } catch (error) {
        customError(error);
        loggers.error('Error al agregar producto al carrito');
        res.status(500).redirect('/login');
    }
};

// Eliminar un producto del carrito
export const deleteCartByIdController = async (req, res) => { // DAO Aplicado  
    const user = getUserFromToken(req);
    const { cartId, itemId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).json({ error: 'ID de carrito inválido' });
    }

    try {
        const cart = await CartService.getById(cartId);

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
        customError(error);
        loggers.error('Error al eliminar un producto del carrito', error);
        return res.status(500).render('error/notCart', { user });
    }
};
