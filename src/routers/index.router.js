import { Router } from 'express';
import { getIndexProductsController } from '../controllers/products.controller.js';
const router = Router();

router.get('/', getIndexProductsController );

export default router;
