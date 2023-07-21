import Product from '../models/products.model.js';
import { generateMockProducts } from '../services/mocking.service.js';
import { Router } from 'express';
import loggers from '../server/logger.js';
import { errorMessagesProductosMocking } from '../services/errors/info.js';
import CustomError from '../services/errors/custom_error.js';
import EErrors from '../services/errors/enums.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        await generateMockProducts();

        // Obtener los productos generados
        const products = await Product.find().limit(100);

        res.json({ products });
    } catch (err) {
        loggers.error('Error al generar productos de prueba:', err);

        const customError = new CustomError(
            errorMessagesProductosMocking.internalServerError,
            EErrors.InternalServerError
        );

        next(customError);
    }
});

export default router;
