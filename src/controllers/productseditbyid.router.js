import Product from '../models/products.model.js';
import isAdmin from '../middlewares/admin.middleware.js';
import configureMulter from '../helpers/multer.helpers.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';
import loggers from '../server/logger.js'

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const upload = await configureMulter();

router.get('/:pid', isAdmin, async (req, res) => {
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
});


router.post('/:id', upload.single('thumbnail'), async (req, res) => {
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
});


export default router

