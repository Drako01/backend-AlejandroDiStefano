import { Router } from 'express';
import isAdmin from '../middlewares/admin.middleware.js';
import configureMulter from '../helpers/multer.helpers.js';
import { 
    getProductsInRealTimeController, 
    sendProductsInRealTimeController 
} from '../controllers/real-time.products.controller.js';


const router = Router();
const upload = await configureMulter();


router.get('/', isAdmin, getProductsInRealTimeController);

router.post('/', upload.single('thumbnail'), sendProductsInRealTimeController);


export default router
