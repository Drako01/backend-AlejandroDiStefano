import { Router } from 'express';
import { getPurchaseController,
        sendPurchaseController,
        sendPayloadController
        } 
        from '../controllers/products.controller.js';
import { checkPremiumUser } from '../middlewares/premium.users.middleware.js';
const router = Router();

// Endpoint para mostrar el carrito de compras
router.get('/', checkPremiumUser, getPurchaseController);

router.post('/payment-intent', checkPremiumUser, sendPayloadController);

router.post('/', checkPremiumUser, sendPurchaseController);


export default router;
