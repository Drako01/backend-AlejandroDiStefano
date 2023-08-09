import { getUserFromToken } from './user.middleware.js';
export const checkPremiumUser = (req, res, next) => {   
    const user = getUserFromToken(req);
    if (user && ( user.premium || user.user.premium) === true) {
        req.session.isPremium = true;
    } else {
        req.session.isPremium = false;
    }
    next();
};