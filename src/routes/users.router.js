import { Router } from 'express';
import User from '../models/users.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
const router = Router();

// Ruta para crear un nuevo usuario
router.get('/', isAdmin, async (req, res) => {
    const user = getUserFromToken(req);
    try {
        const users = await User.find();
        const userObjects = users.map(user => user.toObject());
        res.render('users', { users: userObjects, user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor');
    }
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
        console.error(err);
        res.status(500).send('Error del servidor');
    }
});

// Ruta para editar un usuario
router.post('/edit/:id', isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const { first_name, last_name, email, phone, age, role } = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, {
            first_name,
            last_name,
            email,
            phone,
            age,
            role
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).render('error/error404');
        }

        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor');
    }
});



// Ruta para eliminar un usuario
router.get('/delete/:id', isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).render('error/error404');
        }

        // Eliminar el usuario de la base de datos
        await User.findByIdAndRemove(userId);

        res.render('userDelete', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor');
    }
});

export default router
