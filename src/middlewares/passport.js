import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/users.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;

export const generateToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        phone: user.phone,
    };

    const token = jwt.sign(payload, secret, {
        expiresIn: '24h',
    });

    return token;
};

export const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Missing authorization token' });
    }

    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        User.findById(decodedToken.userId)
            .exec()
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                req.user = user;
                next();
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({ message: 'Internal server error' });
            });
    });
};


passport.use(
    'signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const existingUser = await User.findOne({ email: email });
                const existingUserPhone = await User.findOne({ phone: req.body.phone });

                if (existingUser) {
                    return done(null, false, { message: 'Email already exists.' });
                }
                if (existingUserPhone) {
                    return done(null, false, { message: 'Phone already exists.' });
                }

                const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                const newUser = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: email,
                    phone: req.body.phone,
                    age: req.body.age,
                    role: req.body.role,
                    password: hash
                });

                await newUser.save();
                return done(null, newUser);
            } catch (err) {
                console.error(err);
                return done(err);
            }
        }
    )
);


const initializePassport = () => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });

    return passport.initialize(); // Retorna el middleware de inicialización de Passport
};

export default initializePassport;
