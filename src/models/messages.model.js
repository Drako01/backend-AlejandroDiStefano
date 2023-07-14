import mongoose from 'mongoose';

const messagesCollection = 'messages';

const messagesSchema = new mongoose.Schema({
    user: {
        type: String,
        index: true
    },
    message: [{
        type: String,
    }]
});

const Messages = mongoose.model('Messages', messagesSchema, messagesCollection);


export default Messages;