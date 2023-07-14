import mongoose from "mongoose";
import config from "../config/config.js";

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
            console.log(`Conexión exitosa a la base de datos "${mongoDatabase}"`);
        } catch(err) {
            throw new Error('cannot connect to database')
        }
    }
}