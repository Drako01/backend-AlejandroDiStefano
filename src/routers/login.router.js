import { Router } from 'express';
import { 
    getUserFromCookiesController,
    getLogginController,
    sendLogginController
} from '../controllers/sessions.controller.js';

const router = Router();


router.get('/', getLogginController);

router.post('/', sendLogginController);

router.get('/user', getUserFromCookiesController) 

export default router;
