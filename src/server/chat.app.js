import Messages from '../models/messages.model.js';
import loggers from './logger.js'

const chatApp = (socketServer) => {
    let log = [];
    let newproduct = [];

    socketServer.on('connection', (socketClient) => {
        let queryUser = socketClient.handshake.query.user;
        loggers.info(`Nuevo cliente "${queryUser}" conectado...`);


        socketClient.on('message', (data) => {
            loggers.info(`${data.user} Envió: ${data.message}`);
            log.push(data);
            socketClient.emit('history', log);
            socketClient.broadcast.emit('history', log);


            Messages.findOneAndUpdate({ user: data.user }, { $push: { message: data.message } }, { upsert: true })
                .then(() => {
                    loggers.info(`El Mensaje de ${data.user} se guardó en el modelo`);
                })
                .catch(err => {
                    loggers.error('Error al guardar el mensaje en el modelo:', err);
                });
        });


        socketClient.on('product', (dataProd) => {
            newproduct.push(dataProd);
            socketClient.emit('product-list', newproduct);
            socketClient.broadcast.emit('product-list', newproduct);
        });

        socketClient.broadcast.emit('newUser', queryUser);
    });
}
export default chatApp;