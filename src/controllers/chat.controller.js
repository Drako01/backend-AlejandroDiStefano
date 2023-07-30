import Chat from '../daos/models/messages.model.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import customError from '../services/error.log.js';

export const getChatsController = async (req, res) => {
    let user = getUserFromToken(req);        
    try {        
        const messages = await Chat.find();        
        res.render('chat', { messages, user });
    } catch (error) {
        customError(error);
        loggers.error('Error al obtener los mensajes');
        res.status(500).render('error/error500', { user });
    }
};

export const sendChatController = async (req, res) => {
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
    } catch (error) {
        customError(error);
        loggers.error('Error al guardar el mensaje');
        res.status(500).render('error/error500', { user });
    }
};

