import Product from '../daos/models/products.model.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import loggers from '../server/logger.js'


export const adminPanelController = async (req, res) => {
    const products = await Product.find().lean();    
    try {
        const user = getUserFromToken(req); 
        if (user.role !== 'admin') {
            return res.status(403).render('error/notAuthorized');
        }
        res.status(200).render('admin_panel', { products, user });        
    } catch (error) {
        loggers.error(`Error al obtener los datos solicitados de la base de datos: ${error}`);
        return res.status(403).render('error/notAuthorized');
    }
};
