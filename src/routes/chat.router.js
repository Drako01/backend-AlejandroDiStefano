import { Router } from 'express';
import Chat from '../models/messages.model.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
const router = Router();

router.get('/', async (req, res) => {
    try {        
        let user = getUserFromToken(req);        
        const messages = await Chat.find();
        
        res.render('chat', { messages, user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los mensajes');
    }
});


router.post('/', async (req, res) => {
    try {
        let user = '';

        if (req.body.user) {
            user = req.body.user.toString();
        } else {
            const userData = getUserFromToken(req);
            user = userData.email.toString();
        }

        const message = req.body.message;
        const newMessage = new Chat({ user, message });
        await newMessage.save();
        res.redirect('/chat');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al guardar el mensaje');
    }
});


export default router
