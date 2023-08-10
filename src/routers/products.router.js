import { Router } from 'express'
import {
    getAllProductsController,
    getProductByCategoryController,
    createProductController,    
    getProductByIdController
} from '../controllers/products.controller.js'


const router = Router()
import configureMulter from '../helpers/multer.helpers.js';

const uploadProductThumbnail = configureMulter('img');

router.get('/', getAllProductsController)
router.post('/', uploadProductThumbnail.single('thumbnail'), createProductController)
router.get('/filter/:category', getProductByCategoryController)
router.get('/:pid', getProductByIdController)



export default router