import Product from '../models/products.model.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import configureMulter from '../helpers/multer.helpers.js';
import { Router } from 'express';
import config from '../server/config.js';
import loggers from '../server/logger.js'

const router = Router();
const cookieName = config.jwt.cookieName;


let user = null;
router.get('/', async (req, res, next) => {
    try {
        const userToken = req.cookies[cookieName];
        if (userToken) {
            user = getUserFromToken(req);
        }

        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const category = req.query.category;
        const filter = category ? { category } : {};

        const result = await Product.aggregate([
            { $match: filter },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ]);

        const productos = result;
        const prevLink = page > 1 ? `/products?page=${page - 1}` : '';
        const nextLink = productos.length === limit ? `/products?page=${page + 1}` : '';

        const allCategories = await Product.distinct('category');
        if (user) {
            res.render('products', { productos, prevLink, nextLink, allCategories, user });
        } else {
            res.render('products', { productos, prevLink, nextLink, allCategories });
        }

    } catch (err) {
        loggers.error(err);
        next(err);
    }
});

const upload = await configureMulter();

router.post('/', upload.single('thumbnail'), async (req, res) => {
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

        const result = await Product.paginate({}, { page, limit, lean: true });

        const productos = result.docs;
        const prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}` : '';
        const nextLink = result.hasNextPage ? `/products?page=${result.nextPage}` : '';

        res.render('products', { productos, prevLink, nextLink });

    } catch (err) {
        loggers.error(err);
        res.status(500).render('Error al guardar el producto en la base de datos');
    }
});

router.get('/filter/:category', async (req, res, next) => {
    try {
        const userToken = req.cookies[cookieName];
        if (userToken) {
            user = getUserFromToken(req);
        }

        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const category = req.params.category;
        const filter = category ? { category } : {};

        const count = await Product.countDocuments(filter);
        const totalPages = Math.ceil(count / limit);
        const currentPage = Math.min(page, totalPages);

        const result = await Product.aggregate([
            { $match: filter },
            { $skip: (currentPage - 1) * limit },
            { $limit: limit }
        ]);

        const productos = result;
        const prevLink = `/products/filter/${category}?page=${currentPage - 1}`;
        const nextLink = `/products/filter/${category}?page=${currentPage + 1}`;

        const allProducts = await Product.find({}).distinct('category');
        res.render('products', { productos, prevLink, nextLink, allProducts, currentPage, totalPages, user });

    } catch (err) {
        loggers.error(err);
        next(err);
    }
});


export default router;
