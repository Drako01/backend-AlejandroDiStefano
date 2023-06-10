import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
    try {        
        res.render('checkout');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al procesar la compra');
    }
});

export default router
