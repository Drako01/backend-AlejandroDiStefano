import mongoose from "mongoose";
import config from "../server/config.js";
import loggers from '../server/logger.js'

const mongoConnection = config.db.mongo_connection;
const mongoDatabase = config.db.mongo_database;

export default class MongoClient {
    constructor() {
        this.connected = true
        this.client = mongoose
    }

    connect = async() => {
        try {
            await this.client.connect(mongoConnection);
            loggers.info(`Conexión exitosa a la base de datos "${mongoDatabase}" en MongoDB Atlas`);
        } catch(err) {
            throw new Error('cannot connect to database')
        }
    }
}