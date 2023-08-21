import Product from '../daos/models/products.model.js';
import { ProductService, CartService } from '../repositories/index.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import config from '../config/config.js';
import loggers from '../config/logger.js'
import { sendPurchaseConfirmationEmail } from '../helpers/nodemailer.helpers.js';
import customError from '../services/error.log.js';
import { generateMockProducts } from '../services/mocking.service.js';
import { removeProductFromCart } from '../helpers/functions.helpers.js';

import { sendSMS } from '../helpers/twilio.helpers.js';
const cookieName = config.jwt.cookieName;

export const getIndexProductsController = async (req, res) => { // DAO Aplicado
    try {
        const limit = parseInt(req.query.limit);
        const products = await ProductService.getAll();
        const userToken = req.cookies[cookieName];
        const user = getUserFromToken(req);
        if (!userToken || !user) {
            res.status(200).render('index', { products: products.slice(0, 4), productLength: products.length, user: null });
            return;
        }
        if (isNaN(limit)) {
            res.status(200).render('index', { products: products.slice(0, 4), productLength: products.length, user });
        } else {
            res.status(200).render('index', { products: products.slice(0, limit), productLength: products.length, user });
        }
    } catch (error) {
        customError(error);
        loggers.error('Productos no encontrados');
        res.status(500).render('error/notProduct', { user })
    }
}
let user = null;
// Obtener todos los productos
export const getAllProductsController = async (req, res, next) => { // DAO Aplicado
    try {        
        user = getUserFromToken(req);       
        const userToken = req.cookies[cookieName];        
        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const category = req.query.category;
        const filter = category ? { category } : {};

        const result = await ProductService.setCategory([
            { $match: filter },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ]);

        const productos = result;
        const prevLink = page > 1 ? `/products?page=${page - 1}` : '';
        const nextLink = productos.length === limit ? `/products?page=${page + 1}` : '';

        const allCategories = await ProductService.getByCategory('category');
        if (!userToken || !user) {
            res.render('products', { productos, prevLink, nextLink, allCategories, user: null });
        } else {
            res.render('products', { productos, prevLink, nextLink, allCategories, user });
        }

    } catch (error) {
        customError(error);
        loggers.error('Productos no encontrados');
        res.status(500).render('error/notProduct', { user })
    }
};
// Crear un producto
export const createProductController = async (req, res) => { // DAO Aplicado
    const { title, category, size, code, description, price, stock } = req.body;
    user = getUserFromToken(req);
    if (!title) {
        return res.status(400).send('El campo "title" es obligatorio');
    }
    const newProduct = new Product({
        title,
        category,
        size,
        status: true,
        code,
        description,
        price: parseInt(price),
        stock,
        thumbnail: `/img/${req.file.filename}` // Comentado para poder pasar el test
    });

    try {
        await newProduct.save();

        const page = 1;
        const limit = 16;

        const result = await ProductService.paginate({}, { page, limit, lean: true });

        const productos = result.docs;
        const prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}` : '';
        const nextLink = result.hasNextPage ? `/products?page=${result.nextPage}` : '';

        res.render('products', { productos, prevLink, nextLink, user });

    } catch (error) {
        customError(error);
        loggers.error('Error al guardar el producto en la base de datos');
        res.status(500).render('error/notProduct', { user })
    }
};
// Obtener un producto por Category
export const getProductByCategoryController = async (req, res, next) => { // DAO Aplicado
    try {
        const userToken = req.cookies[cookieName];
        if (userToken) {
            user = getUserFromToken(req);
        }

        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const category = req.params.category;
        const filter = category ? { category } : {};

        const count = await ProductService.filter(filter);
        const totalPages = Math.ceil(count / limit);
        const currentPage = Math.min(page, totalPages);

        const result = await ProductService.setCategory([
            { $match: filter },
            { $skip: (currentPage - 1) * limit },
            { $limit: limit }
        ]);

        const productos = result;
        const prevLink = `/products/filter/${category}?page=${currentPage - 1}`;
        const nextLink = `/products/filter/${category}?page=${currentPage + 1}`;

        const allProducts = await ProductService.getByCategoryAll('category');
        res.render('products', { productos, prevLink, nextLink, allProducts, currentPage, totalPages, user });

    } catch (error) {
        customError(error);
        loggers.error('Productos no encontrados');
        res.status(500).render('error/notProduct', { user })
    }
};

export const getProductByIdController = async (req, res) => { // DAO Aplicado
    const productId = req.params.pid;
    const user = getUserFromToken(req);
    const adminRole = user ? user.role === 'admin' : false;

    try {
        const product = await ProductService.getById(productId);

        if (!product) {
            res.status(404).render('error/error404', { user });
            return;
        }
        res.render('productsid', { product, user, adminRole });
    } catch (error) {
        customError(error);
        loggers.error('Error al obtener el producto por ID');
        res.status(500).render('error/notProduct', { user });
    }
};

export const getPurchaseController = async (req, res) => {
    try {
        const user = getUserFromToken(req);
        const isPremium = user.premium || user.user.premium || false;
        const discountMultiplier = isPremium ? 0.8 : 1;
        const cart = await CartService.getOnePopulate({ user: { email: user.email || user.user.email } })

        if (!cart) {
            res.status(404).render('error/error404', { user });
            return;
        }

        const productsOutOfStock = cart.items.filter(item => item.producto.stock <= 0);

        if (productsOutOfStock.length > 0) {
            for (const item of productsOutOfStock) {
                await removeProductFromCart(cart, item.producto._id);
            }
            const updatedCart = await CartService.getOnePopulate({ _id: cart._id })
            const subTotal = updatedCart.items.reduce((total, item) => total + (item.producto.price * item.cantidad), 0);
            const totalPrice = (subTotal * discountMultiplier).toFixed(2);

            res.render('checkout', { cart: updatedCart, code: updatedCart.code, purchaseDatetime: updatedCart.purchase_datetime, totalPrice, user });
        } else {
            const subTotal = cart.items.reduce((total, item) => total + (item.producto.price * item.cantidad), 0);
            const totalPrice = (subTotal * discountMultiplier).toFixed(2);

            res.render('checkout', { cart, code: cart.code, purchaseDatetime: cart.purchase_datetime, totalPrice, user });
        }
    } catch (error) {
        customError(error);
        loggers.error('Error al procesar la compra')
        res.status(500).render('error/error500', { user });
    }
}

export const sendPurchaseController = async (req, res) => { // DAO Aplicado
    const user = getUserFromToken(req);
    //const { cardNumber, cardName, cardExpiration, cardCvv } = req.body;
    
    // Aca deberia verificar los datos de la tarjeta de credito
    try {
        
        const isPremium = user.premium || (user.user && user.user.premium) || false;
        const discountMultiplier = isPremium ? 0.8 : 1;
        const cart = await CartService.getOne({ user: { email: user.email || user.user.email } })

        if (!cart) {
            res.status(404).render('error/error404', { user });
            return;
        }
        // Crear un nuevo array con los productos que tienen stock suficiente
        const productsWithSufficientStock = [];

        // Checkear el stock de cada producto en el carrito
        for (const item of cart.items) {
            try {
                const product = await ProductService.getById(item.producto._id);
                if (!product) {
                    loggers.warning(`Producto no encontrado con el id: ${item.producto._id}`);
                    continue;
                }

                const newStock = product.stock - item.cantidad;
                if (newStock >= 0) {
                    // Si hay stock suficiente, agregar el producto al nuevo array y actualizar el stock
                    productsWithSufficientStock.push(item);
                    product.stock = newStock;
                    await product.save();
                } else {
                    // Si no hay stock suficiente, mostrar un mensaje de error y actualizar el stock
                    loggers.warn(`El producto: ${item.producto.title} esta fuera de stock.!`);
                    product.stock += (item.cantidad - product.stock);
                    await product.save();
                }

            } catch (error) {
                customError(error);
                loggers.error('Error al checkear los productos del carrito')
                res.status(500).render('error/error500', { user })
            }
        }

        // Actualizar el carrito con los productos que tienen stock suficiente
        cart.items = productsWithSufficientStock;

        // Chequear si quedaron productos en el carrito
        if (cart.items.length === 0) {
            // Error: no hay stock suficiente para ninguno de los productos del carrito
            res.render('error/notStock', { user, products: cart.items.map((item) => item.producto) });
            return;
        }
        const subTotal = cart.items.reduce((total, item) => total + (item.producto.price * item.cantidad), 0);
        const totalPrice = (subTotal * discountMultiplier).toFixed(2);
        const useremail = user.email || user.user.email || false        
        await sendPurchaseConfirmationEmail(useremail, cart, user);
        await sendSMS(user.phone); // Descomentar para enviar un SMS

        res.render('checkout', { cart, code: cart.code, purchaseDatetime: cart.purchase_datetime, totalPrice, user });
    } catch (error) {
        customError(error);
        loggers.error('Error al procesar la compra en el Checkout')
        res.status(500).render('error/error500', { user })
    }
}

export const getMockingProductsController = async (req, res, next) => { // DAO Aplicado
    let user = getUserFromToken(req);
    try {
        await generateMockProducts();
        // Obtener los productos generados
        const limit = 100
        const products = await ProductService.getAllLimit(limit);
        res.status(200).render('index', { products, user });
    } catch (error) {
        customError(error);
        loggers.error('Error al generar productos de prueba', error);
        res.status(500).render('error/error500', { user });
    }
}

export const getProductForEditByIdController = async (req, res) => { // DAO Aplicado
    const productId = req.params.pid;
    const user = getUserFromToken(req);
    try {
        const producto = await ProductService.getById(productId)
        if (producto) {
            res.render('productsedit', { producto, user });
        } else {
            res.status(404).render('error/error404', { user });
        }
    } catch (error) {
        customError(error);
        loggers.error('Producto no encontrado');
        res.status(500).render('error/notProduct', { user })
    }
}