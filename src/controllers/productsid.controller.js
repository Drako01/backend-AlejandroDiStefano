import Product from '../daos/models/products.model.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';


export const getProductByIdController = async (req, res) => {
    const productId = req.params.pid;
    const product = await Product.findById(productId).lean();
    const user = getUserFromToken(req);
    const adminRole = user ? user.role === 'admin' : false;
    if (product) {
        res.render('productsid', { product, user, adminRole });
    } else {
        res.status(404).render('error/error404', { user });
    }
};
