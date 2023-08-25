import { Router } from 'express';
import { sendPayloadController } from '../controllers/products.controller.js';
import { checkPremiumUser } from '../middlewares/premium.users.middleware.js';
const router = Router();

router.post('/payment-intent', checkPremiumUser, sendPayloadController);

export default router;
