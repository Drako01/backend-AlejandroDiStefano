import { Router } from 'express'
import { 
    createCartController, 
    addProductToCartController,
    clearCartByid,
    deleteCartById,
    updateProductsToCartById,
    deleteCartByIdController,    
} from '../controllers/carts.controller.js'
import { checkPremiumUser } from '../middlewares/premium.users.middleware.js';
const router = Router()

router.get('/', checkPremiumUser, createCartController)
router.post('/:pid', addProductToCartController)
router.post('/:cartId/vaciar', clearCartByid)
router.post('/:cartId/eliminar', deleteCartById)
router.put('/:cartId/:itemId',updateProductsToCartById)
router.get('/:cartId/:itemId', deleteCartByIdController)


export default router