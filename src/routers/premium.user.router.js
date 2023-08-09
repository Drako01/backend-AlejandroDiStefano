import { Router } from 'express';
import isLoggedIn from '../middlewares/login.middleware.js';
const router = Router();


import { 
    getAllUsersPremiumController
} from '../controllers/user.controller.js';

router.get('/', isLoggedIn, getAllUsersPremiumController);



export default router;
