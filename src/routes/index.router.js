import Handlebars from 'handlebars';
import { Router } from 'express';
import Product from '../models/products.model.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import config from '../server/config.js';
import loggers from '../server/logger.js'

const router = Router();
const cookieName = config.jwt.cookieName;

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await Product.find().lean();
        const userToken = req.cookies[cookieName];
        
        if (!userToken) {
            res.status(200).render('index', { products: products.slice(0, 4), productLength: products.length, user: null });
            return;
        }
        const user = getUserFromToken(req) ;      

        if (!user) {
            res.status(200).render('index', { products: products.slice(0, 4), productLength: products.length, user: null });
            return;
        }

        if (isNaN(limit)) {
            res.status(200).render('index', { products: products.slice(0, 4), productLength: products.length, user });
        } else {
            res.status(200).render('index', { products: products.slice(0, limit), productLength: products.length, user });
            
        }
    } catch (err) {
        loggers.error(err);
        res.status(500).render({ message: 'Internal server error' });
    }
});

Handlebars.registerHelper('ifEqual', (a, b, options) => {
    return a === b ? options.fn(this) : options.inverse(this);
});

export default router;
