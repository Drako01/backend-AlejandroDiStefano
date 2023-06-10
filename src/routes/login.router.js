import { Router } from 'express';
import User from '../models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken } from '../middlewares/passport.js';
const router = Router();
import dotenv from 'dotenv';
dotenv.config();
const secret = process.env.PRIVATE_KEY;
const cokieName = process.env.JWT_COOKIE_NAME;

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email }).exec();

        if (!user) {
            return res.status(400).send({ status: 'error', error: 'Invalid credentials' });
        }

        bcrypt.compare(password, user.password)
            .then(result => {
                if (result) {
                    const token = generateToken(user);
                    const userToken = token;

                    const decodedToken = jwt.verify(userToken, secret); 
                    const userId = decodedToken.userId;

                    res.cookie(cokieName, userToken).redirect('/');
                } else {
                    return res.status(400).send({ status: 'error', error: 'Invalid credentials' });
                }
            })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Ruta para obtener los datos del usuario almacenados en la cookie
router.get('/user', (req, res) => {
    const userToken = req.cookies[cokieName];
    
    if (!userToken) {
        return res.status(401).send({ status: 'error', error: 'Unauthorized' });
    }

    try {
        const decodedToken = jwt.verify(userToken, cokieName);
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
