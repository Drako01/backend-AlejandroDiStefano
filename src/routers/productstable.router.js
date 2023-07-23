
import isAdmin from '../middlewares/admin.middleware.js';
import { Router } from 'express';
import { getTableProductsController } from '../controllers/products.admin.controller.js';


const router = Router();

router.get('/', isAdmin, getTableProductsController);


export default router;