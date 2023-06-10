import { Router } from 'express';
import User from '../models/users.model.js';
import isAdmin from '../middlewares/isAdmin.js';
const router = Router();
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.PRIVATE_KEY;
const cokieName = process.env.JWT_COOKIE_NAME;


// Ruta para crear un nuevo usuario
router.get('/', isAdmin, async (req, res) => {
    const userToken = req.cookies[cokieName];
    const decodedToken = jwt.verify(userToken, secret);
    const user = decodedToken;
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
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
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
            return res.status(404).send('Usuario no encontrado');
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
            return res.status(404).send('Usuario no encontrado');
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
