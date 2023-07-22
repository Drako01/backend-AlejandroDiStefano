import { Router } from 'express';
import User from '../models/users.model.js';
import isAdmin from '../middlewares/admin.middleware.js';
import isLoggedIn from '../middlewares/login.middleware.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import loggers from '../server/logger.js'
import CustomError from '../services/errors/custom_error.js'
import EErros from '../services/errors/enums.js'
import { generateUserErrorInfo } from '../services/errors/info.js'
const router = Router();

// Ruta para crear un nuevo usuario
router.get('/', isAdmin, async (req, res) => {
    const user = getUserFromToken(req);
    try {
        const users = await User.find();
        const userObjects = users.map(user => user.toObject());
        res.render('users', { users: userObjects, user });
    } catch (err) {
        loggers.error(err);
        res.status(500).send('Error del servidor');
    }
});

router.get('/profile', isLoggedIn, (req, res) => {
    const user = getUserFromToken(req);
    res.render('profileUser', { user });
})

router.get('/newUser', isAdmin, (req, res) => {
    const user = getUserFromToken(req);
    res.render('newUser', { user });
})

// Ruta para crear un nuevo usuario
router.post('/newUser', (req, res) => {
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
});


router.get('/edit/:id', isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId);

        if (!user) {
            user = getUserFromToken(req);
            return res.status(404).render('error/error404', { user });
        }

        res.render('editUser', { user });

    } catch (err) {
        loggers.error(err);
        res.status(500).send('Error del servidor');
    }
});

// Ruta para editar un usuario
router.post('/edit/:id', isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const { first_name, last_name, email, phone, age, role } = req.body;
        let user = getUserFromToken(req);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            first_name,
            last_name,
            email,
            phone,
            age,
            role
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).render('error/error404', { user });
        }

        res.redirect('/users');
    } catch (err) {
        loggers.error(err);
        res.status(500).send('Error del servidor');
    }
});



// Ruta para eliminar un usuario
router.get('/delete/:id', isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).render('error/error404', { user });
        }

        // Eliminar el usuario de la base de datos
        await User.findByIdAndRemove(userId);

        res.render('userDelete', { user });
    } catch (err) {
        loggers.error(err);
        res.status(500).send('Error del servidor');
    }
});


export default router
