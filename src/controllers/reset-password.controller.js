import loggers from '../config/logger.js';
import customError from '../services/error.log.js';
import { sendResetPasswordEmailMethod, resetPassword } from '../helpers/functions.helpers.js';
import { generateToken } from '../middlewares/passport.middleware.js';
import { UserService } from '../repositories/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const secret = config.jwt.privateKey;

// Reset Password
export const getForgotPassword = async (req, res) => {
    res.render('resetPasswordSent', { title: 'Olvidó su contraseña' });
};

export const sendForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserService.getOne({ email });
        if (!user) {
            return res.status(404).render('error/userNotFound', { email });
        }
        const resetToken = generateToken(user._id);         
        await sendResetPasswordEmailMethod(email, resetToken);
        res.redirect('/')

    } catch (err) {
        customError(err);
        loggers.error('Error al enviar el correo de restablecimiento de contraseña.', err);
        return res.status(500).render('error/error500');
    }
};

export const getResetPassword = async (req, res) => {
    const { token } = req.params;
    try {
        res.render('resetPasswordForm', { token });

    } catch (err) {
        customError(err);
        loggers.error('Token inválido o expirado.');
        return res.status(500).render('error/error500');
    }
};

export const setResetPassword = async (req, res) => {
    const token = req.params.token;
    const { password } = req.body; 
    
    const userToken = token;
    const decodedToken = jwt.verify(userToken, secret);
    const userId = decodedToken.userId;
    const pass = await bcrypt.hash(password, 10); 

    try {
        await resetPassword(userId, pass);
        
        res.render('passwordResetSuccess', { user: req.user });

    } catch (err) {
        customError(err);
        loggers.error('Error al restablecer la contraseña.');
        return res.status(500).render('error/error500');
    }
};