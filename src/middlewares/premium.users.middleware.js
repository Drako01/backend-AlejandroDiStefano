import { getUserFromToken } from './user.middleware.js';
export const checkPremiumUser = (req, res, next) => {
    const user = getUserFromToken(req);
    
    let isPremium = false;
    
    if (user) {
        if (user.premium) {
            isPremium = true;
        } else if (user.user && user.user.premium) {
            isPremium = true;
        }
    }
    
    req.session.isPremium = isPremium;
    next();
};
