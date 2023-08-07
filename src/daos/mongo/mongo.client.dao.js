import mongoose from "mongoose";
import config from '../../config/config.js';
import loggers from '../../config/logger.js'
import customError from '../../services/error.log.js';

const mongoConnection = config.db.mongo_connection;
const mongoDatabase = config.db.mongo_database;

export default class MongoClient {
    constructor() {
        this.connected = true
        this.client = mongoose
    }

    connect = async() => {
        try {
            await this.client.connect(mongoConnection, { useNewUrlParser: true, useUnifiedTopology: true });
            loggers.info(`Conexión exitosa a la base de datos "${mongoDatabase}" => MongoDB Atlas`);
        } catch(error) {
            customError(error);
            loggers.fatal('Imposible conectarse a MongoDB Atlas');
        }
    }
}