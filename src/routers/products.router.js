import { Router } from 'express'
import {
    getAllProductsController,
    getProductByCategoryController,
    createProductController,    
} from '../controllers/products.controller.js'
import { getProductByIdController } from '../controllers/productsid.controller.js'


const router = Router()
import configureMulter from '../helpers/multer.helpers.js';

const upload = await configureMulter();

router.get('/', getAllProductsController)
router.post('/', upload.single('thumbnail'), createProductController)
router.get('/filter/:category', getProductByCategoryController)
router.get('/:pid', getProductByIdController)



export default router