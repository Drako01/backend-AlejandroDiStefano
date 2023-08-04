import { Router } from 'express';
import isAdmin from '../middlewares/admin.middleware.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';

const router = Router();

router.get('/', isAdmin, (req, res) => {
    const user = getUserFromToken(req);
    res.render('documentation', {user});
});




export default router
