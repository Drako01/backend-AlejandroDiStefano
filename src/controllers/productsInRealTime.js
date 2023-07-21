import Product from '../models/products.model.js';
import isAdmin from '../middlewares/admin.middleware.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import configureMulter from '../helpers/multer.helpers.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import loggers from '../server/logger.js'
import { Router } from 'express';
const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const upload = await configureMulter();


router.get('/', isAdmin, (req, res) => {
    const user = getUserFromToken(req);    
    res.render('realtimeproducts', { user });
});

router.post('/', upload.single('thumbnail'), async (req, res) => {
    const { title, category, size, code, description, price, stock } = req.body;
    if (!title) {
        return res.status(400).render('El campo "title" es obligatorio');
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
        ...(req.file ? { thumbnail: `/img/${req.file.filename}` } : {})
    });

    try {
        await newProduct.save();            
        const product = await Product.find().lean();
        res.render('realtimeproducts', { product: product });

    } catch (err) {
        loggers.error(err);
        res.status(500).render('error/notProduct' , { user })
    }
});


export default router
