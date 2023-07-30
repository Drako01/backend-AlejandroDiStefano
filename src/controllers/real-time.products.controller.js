import Product from '../daos/models/products.model.js';
import { ProductService } from '../repositories/index.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import loggers from '../config/logger.js'
import customError from '../services/error.log.js';


export const getProductsInRealTimeController = async (req, res) => {
    const user = getUserFromToken(req);    
    res.render('realtimeproducts', { user });
};

export const sendProductsInRealTimeController = async (req, res) => { // DAO Aplicado
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
        const product = await ProductService.getAll();
        res.render('realtimeproducts', { product: product , user: req.user});

    } catch (error) {
        customError(error);
        loggers.error('Producto no encontrado');
        res.status(500).render('error/notProduct' , { user })
    }
};

