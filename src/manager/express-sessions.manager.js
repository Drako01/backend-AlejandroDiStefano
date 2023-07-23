import session from 'express-session';
import MongoStore from 'connect-mongo';
import config from '../config/config.js';

const configureSession = (app) => {
    const mongoConnection = config.db.mongo_connection;
    const mongoDatabase = config.db.mongo_database;
    const secret = config.db.secret;

    app.use(
        session({
            secret: secret,
            resave: true,
            saveUninitialized: true,
            store: MongoStore.create({
                mongoUrl: mongoConnection,
                dbName: mongoDatabase,
                collectionName: 'sessions',
                mongoOptions: {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                },
            }),
        })
    );

    app.use((req, res, next) => {
        res.locals.isLoggedIn = req.session.user ? true : false;
        res.locals.userRole = req.session.user ? req.session.user.role : null;
        next();
    });
};

export default configureSession;
