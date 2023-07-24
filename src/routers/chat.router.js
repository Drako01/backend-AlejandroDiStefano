import { Router } from 'express';
import isLoggedIn from '../middlewares/login.middleware.js';
import { 
    getChatsController, 
    sendChatController 
} from '../controllers/chat.controller.js';


const router = Router();

router.get('/', isLoggedIn, getChatsController);

router.post('/', isLoggedIn, sendChatController);


export default router
