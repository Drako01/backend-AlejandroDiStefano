import { Router } from 'express';
import User from '../models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken } from '../middlewares/passport.js';
import config from '../server/config.js';

const router = Router();
const cookieName = config.jwt.cookieName;
const secret = config.jwt.secret;

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email }).exec();

        if (!user) {
            return res.status(401).send({ status: 'error', error: 'Invalid credentials' });
        }

        bcrypt.compare(password, user.password)
            .then(result => {
                if (result) {
                    const token = generateToken(user);
                    const userToken = token;

                    const decodedToken = jwt.verify(userToken, secret); 
                    const userId = decodedToken.userId;

                    res.cookie(cookieName, userToken).redirect('/');
                } else {
                    return res.status(403).send({ status: 'error', error: 'Invalid credentials' });
                }
            })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Ruta para obtener los datos del usuario almacenados en la cookie
router.get('/user', (req, res) => {
    const userToken = req.cookies[cookieName];
    
    if (!userToken) {
        return res.status(401).send({ status: 'error', error: 'Unauthorized' });
    }

    try {
        const decodedToken = jwt.verify(userToken, cookieName);
        const userId = decodedToken.userId;
        User.findById(userId, (err, user) => {
            if (err || !user) {
                return res.status(404).send({ status: 'error', error: 'User not found' });
            }

            return res.status(200).send({ status: 'success', user });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
