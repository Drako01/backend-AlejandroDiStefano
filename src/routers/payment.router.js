import { Router } from 'express';
import { createSession } from '../controllers/payment.controller.js'
import { sendPurchaseController } from '../controllers/products.controller.js';
const router = Router();


router.post('/create-checkout-session', createSession)
router.get('/success', sendPurchaseController)
router.get('/cancel', (req, res) => res.render('cartsErrorPayload'))

export default router