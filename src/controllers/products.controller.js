import Product from '../daos/models/products.model.js';
import { ProductService } from '../repositories/index.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import config from '../config/config.js';
import loggers from '../config/logger.js'
import Cart from '../daos/models/carts.model.js';
import { errorMessagesProductosMocking } from '../services/errors/info.js';
import CustomError from '../services/errors/custom_error.js';
import EErrors from '../services/errors/enums.js';
import { sendPurchaseConfirmationEmail } from '../helpers/nodemailer.helpers.js';
import { sendSMS } from '../helpers/twilio.helpers.js';


import { generateMockProducts } from '../services/mocking.service.js';
const cookieName = config.jwt.cookieName;

export const getIndexProductsController = async (req, res) => { // DAO Aplicado
    try {
        const limit = parseInt(req.query.limit);
        const products = await ProductService.getAll();
        const userToken = req.cookies[cookieName];
        
        if (!userToken) {
            res.status(200).render('index', { products: products.slice(0, 4), productLength: products.length, user: null });
            return;
        }
        const user = getUserFromToken(req) ;      
        
        if (!user) {
            res.status(200).render('index', { products: products.slice(0, 4), productLength: products.length, user: null });
            return;
        }

        if (isNaN(limit)) {
            res.status(200).render('index', { products: products.slice(0, 4), productLength: products.length, user });
        } else {
            res.status(200).render('index', { products: products.slice(0, limit), productLength: products.length, user });            
        }
    } catch (err) {
        loggers.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}
let user = null;
// Obtener todos los productos
export const getAllProductsController = async (req, res, next) => { // DAO Aplicado
    try {
        const userToken = req.cookies[cookieName];
        if (userToken) {
            user = getUserFromToken(req);
        }

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

        res.render('products', { productos, prevLink, nextLink, allCategories, user });
        

    } catch (err) {
        loggers.error(err);
        next(err);
    }
};
// Crear un producto
export const createProductController = async (req, res) => { // DAO Aplicado
    const { title, category, size, code, description, price, stock } = req.body;
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
        thumbnail: `/img/${req.file.filename}`
    });
    
    try {
        await newProduct.save();

        const page = 1;
        const limit = 16;

        const result = await ProductService.paginate({}, { page, limit, lean: true });

        const productos = result.docs;
        const prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}` : '';
        const nextLink = result.hasNextPage ? `/products?page=${result.nextPage}` : '';

        res.render('products', { productos, prevLink, nextLink });

    } catch (err) {
        loggers.error(err);
        res.status(500).send('Error al guardar el producto en la base de datos');
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

    } catch (err) {
        loggers.error(err);
        next(err);
    }
};

export const getProductByIdController = async (req, res) => { // DAO Aplicado
    const productId = req.params.pid;
    const product = await ProductService.getById(productId)
    const user = getUserFromToken(req);
    const adminRole = user ? user.role === 'admin' : false;
    if (product) {
        res.render('productsid', { product, user, adminRole });
    } else {
        res.status(404).render('error/error404', { user });
    }
};

export const getPurchaseController = async (req, res) => {
    try {
        const user = getUserFromToken(req);
        const cart = await Cart.findOne({ user: { email: user.email || user.user.email } }).populate('items.producto');

        if (!cart) {
            res.status(404).render('error/error404', { user });
            return;
        }

        const totalPrice = cart.items.reduce((total, item) => total + (item.producto.price * item.cantidad), 0);

        res.render('checkout', { cart, code: cart.code, purchaseDatetime: cart.purchase_datetime, totalPrice, user });
    } catch (err) {
        loggers.error(err);
        res.status(500).send('Error al procesar la compra');
    }
}

export const sendPurchaseController = async (req, res) => { // DAO Aplicado
    try {
        const user = getUserFromToken(req);
        const cart = await Cart.findOne({ user: { email: user.email || user.user.email } }).populate('items.producto');

        if (!cart) {
            res.status(404).render('error/error404', { user });
            return;
        }

        // Crear un nuevo array con los productos que tienen stock suficiente
        const productsWithSufficientStock = [];

        // Checkear el stock de cada producto en el carrito
        for (const item of cart.items) {
            try {
                const product = await Product.findById(item.producto._id);
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
            } catch (err) {
                loggers.error('Error al actualizar el stock', err);
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

        // Enviar el correo electrónico de confirmación de compra
        await sendPurchaseConfirmationEmail(user.email || user.user.email, cart, user);
        //await sendSMS(user.phone); // Descomentar para enviar un SMS

        const totalPrice = cart.items.reduce((total, item) => total + (item.producto.price * item.cantidad), 0);
        res.render('checkout', { cart, code: cart.code, purchaseDatetime: cart.purchase_datetime, totalPrice, user });
    } catch (err) {
        loggers.error(err);
        res.status(500).send('Error al procesar la compra');
    }
}

export const getMockingProductsController = async (req, res, next) => { // DAO Aplicado
    try {
        await generateMockProducts();
        user = getUserFromToken(req);
        // Obtener los productos generados
        const products = await ProductService.getAllLimit(100);
        res.status(200).render('index', { products, user });          
    } catch (err) {
        loggers.error('Error al generar productos de prueba:', err);

        const customError = new CustomError(
            errorMessagesProductosMocking.internalServerError,
            EErrors.InternalServerError
        );

        next(customError);
    }
}

export const getProductForEditByIdController = async (req, res) => { // DAO Aplicado
    const productId = req.params.pid;
    const user = getUserFromToken(req);
    try {
        const producto = await ProductService.getById(productId)
        if (producto) {
            res.render('productsedit', { producto, user});
        } else {
            res.status(404).render('error/error404', { user });
        }
    } catch (error) {
        loggers.error(error);
        res.status(500).render('error/notProduct' , { user })
    }
}