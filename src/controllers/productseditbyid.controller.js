import Product from '../daos/models/products.model.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import loggers from '../server/logger.js'


export const editProductByIdController = async (req, res) => {
    const user = getUserFromToken(req);
    try {
        const productId = req.params.pid;
        const producto = await Product.findById(productId).lean();
        if (producto) {

            res.status(200).render('productseditbyid', { producto, user });
        } else {
            res.status(404).render('error/error404', { user });
        }
    } catch (error) {
        loggers.error(error);
        res.status(500).render('error/notProduct' , { user })
    }
};


export const editAndChargeProductByIdController = async (req, res) => {
    try {
        const productId = req.params.id;
        const { title, category, size, code, description, price, stock } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
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
        loggers.error(error);
        res.status(500).render('error/notProduct' , { user })
    }
};