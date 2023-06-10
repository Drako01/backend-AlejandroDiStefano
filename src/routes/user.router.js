import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;

export function getUserFromToken(req) {
    const userToken = req.cookies[cookieName];
    const decodedToken = jwt.verify(userToken, secret);
    return decodedToken;
}
