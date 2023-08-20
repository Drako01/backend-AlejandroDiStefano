import { UserService } from '../repositories/index.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import loggers from '../config/logger.js'
import CustomError from '../services/errors/custom_error.js'
import EErros from '../services/errors/enums.js'
import { generateUserErrorInfo } from '../services/errors/info.js'
import UsersDTO from '../dtos/user.dto.js';
import customError from '../services/error.log.js';
import { sendCloseAccountEmail, sendCloseInactivitiAccountEmail, sendPremiumUpgradeUser, sendCloseAccountForUserEmail } from '../helpers/nodemailer.helpers.js';
import { sendResetPasswordEmailMethod, resetPassword } from '../helpers/functions.helpers.js';


// Ruta para crear un nuevo usuario
export const getAllUsersController = async (req, res) => { // DAO + DTO Aplicados    
    try {
        const user = new UsersDTO(getUserFromToken(req));
        const users = await UserService.getAll();
        let resultsDTO = users.map((user) => new UsersDTO(user));
        const userObjects = users.map(user => user.toObject());
        res.render('users', { users: userObjects, user, resultsDTO });
    } catch (err) {
        customError(err);
        loggers.error('Error del servidor');
        res.status(500).render('error/error500', { user });
    }
};

export const getProfileUsersController = async (req, res) => { // Uso de DTO para el Profile del usuario
    const user = getUserFromToken(req)

    res.render('profileUser', { user });
}

export const setProfileUsersController = async (req, res) => { // Uso de DTO para el Profile del usuario
    const user = new UsersDTO(getUserFromToken(req));
    const userId = req.params.id;

    res.render('profilePhoto', { user, userId });
}

export const setPhotoProfileUsersController = async (req, res) => {
    let user = getUserFromToken(req);
    try {
        const userId = req.params.id;
        const { file } = req;
        if (file) {
            user.photo = file.filename;
        } else {
            return res.status(404).render('error/error404', { user });
        }
        const newUserPhoto = await UserService.update(userId, {
            photo: `/img/profile/${file.filename}`
        });

        if (!newUserPhoto) {
            return res.status(404).render('error/error404', { user });
        }

        await newUserPhoto.save();
        let photo = `/img/profile/${file.filename}`
        res.render('profileUserChange', { user, photo, userId });
    } catch (err) {
        customError(err);
        loggers.error('Error del servidor', err);
        res.status(500).render('error/error500', { user });
    }
};

export const getNewUserTest = async (req, res) => {
    const user = getUserFromToken(req);
    res.render('newUser', { user });
}

export const createNewUserTest = async (req, res) => {
    const users = [];
    loggers.info('req.body:', req.body);
    const user = req.body;

    if (!user.first_name || !user.last_name || !user.email) {
        try {
            throw new CustomError(
                'Error de Creacion de Usuario',
                generateUserErrorInfo(user),
                'Error típico al crear un usuario nuevo cuando no se completan los campos obligatorios',
                EErros.INVALID_TYPES_ERROR
            );
        } catch (error) {
            loggers.error(`Error de Creacion de Usuario: ${error.message}`);
            loggers.error(`Información adicional del error: ${error.cause}`);

            return res.redirect('/users/newUser');
        }
    }

    users.push(user);
    res.redirect('/users');
};

export const getUserForEditByIdController = async (req, res) => { // DAO Aplicado
    try {
        const userId = req.params.id;
        let user = await UserService.getById(userId);

        if (!user) {
            user = getUserFromToken(req);
            return res.status(404).render('error/error404', { user });
        }

        res.render('editUser', { user });

    } catch (err) {
        customError(err);
        loggers.error('Error del servidor');
        res.status(500).render('error/error500', { user });
    }
};

export const editUserByIdController = async (req, res) => { // DAO Aplicado
    try {
        const userId = req.params.id;
        const { first_name, last_name, email, phone, age, role, premium, photo } = req.body;
        let user = getUserFromToken(req);
        const updatedUser = await UserService.update(userId, {
            first_name,
            last_name,
            email,
            phone,
            age,
            role,
            premium,
            photo
        });

        if (!updatedUser) {
            return res.status(404).render('error/error404', { user });
        }

        res.redirect('/users');
    } catch (err) {
        customError(err);
        loggers.error('Error del servidor');
        res.status(500).render('error/error500', { user });
    }
};

export const deleteUserByIdController = async (req, res) => { // DAO Aplicado
    try {
        const userId = req.params.id;
        const user = await UserService.getById(userId);

        if (!user) {
            return res.status(404).render('error/error404', { user });
        }

        // Eliminar el usuario de la base de datos
        await UserService.delete(userId);
        try {
            await sendCloseAccountEmail(user.email);
        } catch (err) {
            customError(err);
            loggers.error('Error sending close account email');
        }
        res.render('userDelete', { user });
    } catch (err) {
        customError(err);
        loggers.error('Error del servidor');
        res.status(500).render('error/error500', { user });
    }
};

// Eliminar Usuario por el mismo Usuario
export const deleteUserByUserController = async (req, res) => { // DAO Aplicado
    try {
        const userId = req.params.id;
        const user = await UserService.getById(userId);

        if (!user) {
            return res.status(404).render('error/error404', { user });
        }

        // Eliminar el usuario de la base de datos
        await UserService.delete(userId);
        try {
            await sendCloseAccountForUserEmail(user.email);
        } catch (err) {
            customError(err);
            loggers.error('Error sending close account email');
        }
        res.render('userDeleteByMySelf', { user });
    } catch (err) {
        customError(err);
        loggers.error('Error del servidor');
        res.status(500).render('error/error500', { user });
    }
};

// Borrar Usuarios que no se conectan hace mas de 1 año
export const deleteInactiveUsersController = async (req, res) => {
    try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const inactiveUsers = await UserService.getAll(); 
        
        inactiveUsers.forEach(async (user) => {
            if (user.updatedAt < oneYearAgo) {
                try {
                    await sendCloseInactivitiAccountEmail(user.email);
                    await UserService.delete(user.id);
                    loggers.warn(`Usuario inactivo eliminado: ${user.first_name} ${user.last_name}`);
                } catch (err) {
                    customError(err);
                    loggers.error(`Error eliminando usuario inactivo: ${user.first_name} ${user.last_name}`);
                }
            }
        });

    } catch (err) {
        customError(err);
        loggers.error('Error del servidor', err);
        res.status(500).loggers('Error en el servidor al eliminar usuarios inactivos');
    }
};



// Reset Password
export const getForgotPassword = async (req, res) => {
    res.render('resetPasswordSent');
};

export const sendForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const resetToken = generateToken();
        await sendResetPasswordEmailMethod(email, resetToken);
        res.render('resetPasswordSent', { email });

    } catch (err) {
        customError(err);
        loggers.error('Error al enviar el correo de restablecimiento de contraseña.');
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
    const { token } = req.params;
    const { password } = req.body;
    try {
        await resetPassword(token, password);
        res.render('passwordResetSuccess', { user: req.user });

    } catch (err) {
        customError(err);
        loggers.error('Error al restablecer la contraseña.');
        return res.status(500).render('error/error500');
    }
}

export const getAllUsersPremiumController = async (req, res) => { // DAO + DTO Aplicados
    const user = getUserFromToken(req);
    res.render('usersPremium', { user });
};

// Subir Documentos

export const getDocumentsByUserController = async (req, res) => {
    const user = getUserFromToken(req);   
    try {
        if (user.document.length === 0) {
            return res.render('error/notDocuments', { user });
        } else {
            res.status(200).render('my-documents', { user, document: user.document });
        }
    } catch (error) {
        customError(error);
        loggers.error('Ha ocurrido un error al procesar la peticion.');
        return res.status(500).render('error/error500');
    }
}


export const setDocumentsUsersController = async (req, res) => {
    try {
        let user = getUserFromToken(req);
        const userId = req.params.id;
        if (!req.file) {
            return res.status(404).render('error/error404', { user });
        }
        const documentPath = `/documents/${req.file.filename}`
        const newDocument = await UserService.update(userId, {
            $push: { document: documentPath }
        });

        await newDocument.save();
        res.status(200).render('my-documents', { user, documentPath, userId });
    } catch (error) {
        customError(error);
        loggers.error('Ha ocurrido un error al procesar el archivo.');
        return res.status(500).render('error/error500');
    }

};


export const setPremiumUserController = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await UserService.getById(userId);
        if (!user) {
            return res.status(404).render('error/userNotFound', { userId });
        }
        if (user.document.length > 0 && user.photo.length > 0) {           
            await UserService.update(userId, { premium: true });
            const usermail = user.email 
            sendPremiumUpgradeUser(usermail)
            res.status(200).render('userPremiumValidate', { user });
        } else {
            res.status(200).render('error/notPremium', { user });
        }
    } catch (error) {
        customError(error);
        loggers.error('Ha ocurrido un error al procesar la petición.');
        return res.status(500).render('error/error500');
    }
};

