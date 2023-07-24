import { Router } from 'express';
import { getPurchaseController,
        sendPurchaseController
        } 
        from '../controllers/products.controller.js';

const router = Router();

// Endpoint para mostrar el carrito de compras
router.get('/', getPurchaseController);

router.post('/', sendPurchaseController);

export default router;
