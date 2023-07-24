import { Router } from 'express';
import { getMockingProductsController } from '../controllers/products.controller.js'
const router = Router();

router.get('/', getMockingProductsController);

export default router;
