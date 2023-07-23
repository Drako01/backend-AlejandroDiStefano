import { Router } from 'express'
import { 
    deleteProductByIdController 
} from '../controllers/productsdeletebyid.controller.js'
import {
    editProductByIdController,
    editAndChargeProductByIdController
} from '../controllers/productseditbyid.controller.js'
import { adminPanelController } from '../controllers/adminPanel.controller.js'
import isAdmin from '../middlewares/admin.middleware.js';
const router = Router()

import configureMulter from '../helpers/multer.helpers.js';
const upload = await configureMulter();

router.get('/', isAdmin, adminPanelController)
router.get('/delete/:id', isAdmin, deleteProductByIdController)
router.get('/:pid', isAdmin, editProductByIdController)
router.post('/:id', isAdmin, upload.single('thumbnail'), editAndChargeProductByIdController) //


export default router