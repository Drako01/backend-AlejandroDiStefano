import { CartService, UserService } from '../repositories/index.js';
import loggers from '../config/logger.js'
import customError from '../services/error.log.js';
import { sendResetPasswordEmail, sendPasswordChangedEmail } from './nodemailer.helpers.js';


// Funciones
export async function findCartWithProduct(productId) {
    try {
        const carts = await CartService.getAll({});
        for (const cart of carts) {
            for (const item of cart.items) {
                if (item.producto.toString() === productId) { 
                    return cart; 
                }
            }
        }
        return null;
    } catch (error) {
        loggers.error('Error al buscar el producto en los carritos');
    }
}

export async function removeProductFromCart(cart, productId) {
    try {
        const productIndex = cart.items.findIndex(item => item.producto.toString() === productId);
        
        if (productIndex !== -1) {
            cart.items.splice(productIndex, 1);
            await CartService.update(cart._id, cart);
        }
    } catch (error) {
        customError(error);
        loggers.error('Error al eliminar el producto del carrito');
    }
}

export async function findCartsWithProduct(productId) {
    try {
        const carts = await CartService.getAll({});
        return carts.filter(cart => cart.items.some(item => item.producto.toString() === productId));
    } catch (error) {
        loggers.error('Error al buscar el producto en los carritos');
        return [];
    }
}

export async function removeProductFromCarts(carts, productId) {
    try {
        for (const cart of carts) {
            await removeProductFromCart(cart, productId);
        }
    } catch (error) {
        loggers.error('Error al eliminar el producto del carrito');
    }
}


// Método para restablecer la contraseña
export const sendResetPasswordEmailMethod = async (usermail, token) => {
    try {
        await sendResetPasswordEmail(usermail, token);
    } catch (err) {
        customError(err);
        loggers.error('Error al enviar el correo electrónico');
    }
};

export const resetPassword = async (userId, newPassword) => {
    try {
        const user = await UserService.getById(userId);
        if (!user) {
            throw new Error('Token inválido o expirado.');
        }
        user.password = newPassword;               
        await user.save();  
        const email = user.email;
        await sendPasswordChangedEmail(email)       

    } catch (err) {
        customError(err);
        loggers.error('Error al restablecer la contraseña');
        throw err;
    }
};



