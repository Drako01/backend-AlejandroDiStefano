import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../daos/models/users.model.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import loggers from '../config/logger.js'
import customError from '../services/error.log.js';

const secret = config.jwt.privateKey;


export const generateToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        age: user.age,
        phone: user.phone,
        active: user.active,
        premium: user.premium,        
        updatedAt: user.updatedAt,
        document: user.document,
        photo: user.photo,
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

    jwt.verify(token, secret, (error, decodedToken) => {
        if (error) {
            loggers.error(error);
            return res.status(403).render('error/error403');
        }

        User.findById(decodedToken.userId)
            .exec()
            .then(user => {
                if (!user) {
                    return res.status(404).render('error/error404');
                }

                req.user = user;
                next();
            })
            .catch(error => {
                customError(error);
                loggers.error('Error to verify user token');
                return res.status(500).render('error/error500');
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
                    photo: req.body.photo,
                    password: hash
                });

                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                customError(error);
                loggers.error('Error to signup');
                return done(error)
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

    return passport.initialize(); 
};

export default initializePassport;
