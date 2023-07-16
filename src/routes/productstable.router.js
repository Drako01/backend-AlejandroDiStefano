import Product from '../models/products.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import Handlebars from 'handlebars';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import { Router } from 'express';
import loggers from '../server/logger.js'

const router = Router();

router.get('/', isAdmin, async (req, res) => {
    const user = getUserFromToken(req);
    const sortOption = req.query.sortOption;
    const sortQuery = {};

    if (sortOption === 'desc') {
        sortQuery.price = -1;
    } else if (sortOption === 'unorder') {
        sortQuery.price = null;
    } else {
        sortQuery.price = 1;
    }

    try {
        const products = await Product.find().sort(sortQuery).lean();
        res.render('productstable', { products, user });
    } catch (error) {
        loggers.error(error);
        res.status(500).render('notProduct' , { user })
    }
});

Handlebars.registerHelper('ifEqual', (a, b, options) => {
    return a === b ? options.fn(this) : options.inverse(this);
});

export default router;
