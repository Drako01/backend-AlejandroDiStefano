import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import Users from '../models/users.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Variables de entorno
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const callbackURL = process.env.GITHUB_CALLBACK_URL;
const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;

// Configurar la estrategia local de Passport
const initializePassportGH = () => {
    passport.use(
        'github',
        new GitHubStrategy(
            {
                clientID: clientID,
                clientSecret: clientSecret,
                callbackURL: callbackURL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const user = await Users.findOne({ email: profile._json.email });
                    if (user) return done(null, user);

                    const newUser = await Users.create({
                        first_name: profile._json.name,
                        email: profile._json.email,
                        role: 'user',
                    });
                    const token = jwt.sign({ userId: newUser._id }, secret);
                    res.cookie(cookieName, token, {
                        httpOnly: true,
                        secure: true,
                    });
                    return done(null, newUser);
                } catch (err) {
                    return done('Error to login with GitHub');
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await Users.findById(id);
        done(null, user);
    });
};

export default initializePassportGH;
