import { Router } from 'express'
import { 
    createCartController, 
    addProductToCartController,
    clearCartByid,
    deleteCartById,
    updateProductsToCartById,
    deleteCartByIdController
} from '../controllers/carts.controller.js'

const router = Router()

router.get('/', createCartController)
router.post('/:pid', addProductToCartController)
router.post('/:cartId/vaciar', clearCartByid)
router.post('/:cartId/eliminar', deleteCartById)
router.put('/:cartId/:itemId',updateProductsToCartById)
router.get('/:cartId/:itemId', deleteCartByIdController)



export default router