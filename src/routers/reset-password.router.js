import { Router } from 'express';
const router = Router();

import {
        getResetPassword,
        setResetPassword,
} from '../controllers/reset-password.controller.js';


router.get('/:token', getResetPassword);
router.post('/:token', setResetPassword);

export default router;

