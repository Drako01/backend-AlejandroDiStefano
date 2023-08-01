import { ProductService } from '../repositories/index.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import loggers from '../config/logger.js'
import customError from '../services/error.log.js';
import { sendDeleteProductsEmail } from '../helpers/nodemailer.helpers.js';
import { findCartsWithProduct, removeProductFromCarts } from '../helpers/functions.helpers.js';



// Controladores
export const deleteProductByIdController = async (req, res) => {
    const user = getUserFromToken(req);

    try {
        const productId = req.params.id;
        const product = await ProductService.delete(productId);

        const carts = await findCartsWithProduct(productId);
        
        if (carts && carts.length > 0) {
            const usermailarray = carts.map(cart => cart.user.email);
            await removeProductFromCarts(carts, productId);
            usermailarray.forEach(async (usermail, cart) => {
                await sendDeleteProductsEmail(usermail, carts[cart]); 
            });
        } 

        if (product) {
            res.render('productsdeletebyid', { product, user });
        } else {
            res.status(404).render('error/error404', { user });
        }

    } catch (error) {
        customError(error);
        loggers.error('Producto no encontrado');
        res.status(500).render('error/notProduct', { user });
    }
};

export const getTableProductsController = async (req, res) => { // DAO Aplicado
    const user = getUserFromToken(req);
    const sortOption = req.query.sortOption;
    const sortQuery = {};

    if (sortOption === 'desc') {
        sortQuery.price = -1;
    } else if (sortOption === 'unorder') {
        sortQuery.price = null;
    } else {
        sortQuery.price = 1;
    }

    try {
        const products = await ProductService.getAllQuery(sortQuery);
        res.render('productstable', { products, user });
    } catch (error) {
        customError(error);
        loggers.error('Productos no encontrados');
        res.status(500).render('error/notProduct', { user })
    }

};

export const editProductByIdController = async (req, res) => { // DAO Aplicado
    const user = getUserFromToken(req);
    try {
        const productId = req.params.pid;
        const producto = await ProductService.getById(productId);
        if (producto) {

            res.status(200).render('productseditbyid', { producto, user });
        } else {
            res.status(404).render('error/error404', { user });
        }
    } catch (error) {
        customError(error);
        loggers.error('Producto no encontrado');
        res.status(500).render('error/notProduct', { user })
    }
};

export const editAndChargeProductByIdController = async (req, res) => { // DAO Aplicado
    try {
        const productId = req.params.id;
        const { title, category, size, code, description, price, stock } = req.body;
        const updatedProduct = await ProductService.update(productId, {
            title: title,
            category: category,
            size: size,
            code: code,
            description: description,
            price: price,
            stock: stock,
            ...(req.file ? { thumbnail: `/img/${req.file.filename}` } : {})

        });

        res.redirect(`/productseditbyid/${productId}`);
    } catch (error) {
        customError(error);
        loggers.error('Producto no encontrado');
        res.status(500).render('error/notProduct', { user })
    }
};

export const adminPanelController = async (req, res) => { // DAO Aplicado
    const user = getUserFromToken(req);
    try {
        if (user.role !== 'admin') {
            return res.status(403).render('error/notAuthorized');
        }
        const products = await ProductService.getAll();
        res.status(200).render('admin_panel', { products, user });
    } catch (error) {
        customError(error);
        loggers.error(`Error al obtener los datos solicitados de la base de datos`);
        res.status(500).render('error/error500', { user });
    }
};
