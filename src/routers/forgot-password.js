import { Router } from 'express';
const router = Router();

import {
        sendForgotPassword,
        getForgotPassword,
} from '../controllers/reset-password.controller.js';

router.get('/', getForgotPassword);
router.post('/', sendForgotPassword);

export default router;

