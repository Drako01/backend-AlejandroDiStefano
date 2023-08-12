import { Router } from 'express'
import { 
    deleteProductByIdController,
    editProductByIdController,
    editAndChargeProductByIdController,
    adminPanelController
} from '../controllers/products.admin.controller.js'

import isAdmin from '../middlewares/admin.middleware.js';
const router = Router()

import configureMulter from '../helpers/multer.helpers.js';
const uploadProductThumbnail = configureMulter('img');

router.get('/', isAdmin, adminPanelController)
router.get('/delete/:id', isAdmin, deleteProductByIdController)
router.get('/:pid', isAdmin, editProductByIdController)
router.post('/:id', isAdmin, uploadProductThumbnail.single('thumbnail'), editAndChargeProductByIdController) //


export default router