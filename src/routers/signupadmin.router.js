import { Router } from 'express';
import {
    getSignupAdminController,
    setSignupAdminController
} from '../controllers/sessions.controller.js';

const router = Router();


router.get('/', getSignupAdminController);

router.post('/', setSignupAdminController);

export default router
