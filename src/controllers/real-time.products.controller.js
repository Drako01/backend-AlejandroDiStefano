import Product from '../daos/models/products.model.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import loggers from '../config/logger.js'


export const getProductsInRealTimeController = async (req, res) => {
    const user = getUserFromToken(req);    
    res.render('realtimeproducts', { user });
};

export const sendProductsInRealTimeController = async (req, res) => {
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
};
