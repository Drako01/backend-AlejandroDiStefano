import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;

const isAdmin = (req, res, next) => {
    const userToken = req.cookies[cookieName];

    if (!userToken) {
        res.render('notAuthorized');
        return;
    }

    try {
        const decodedToken = jwt.verify(userToken, secret);
        const user = decodedToken; 

        if (user.role === 'admin') {
            req.user = user; 
            next();
        } else {
            res.render('notAuthorized');
        }
    } catch (err) {
        res.render('notAuthorized');
    }
};

export default isAdmin;
