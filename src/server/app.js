import express from 'express';
import { Server } from 'socket.io';
import path from 'path';
import session from 'express-session';
import methodOverride from 'method-override';
import MongoStore from 'connect-mongo';
import exphbs from 'express-handlebars';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { Command } from 'commander';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import config from './config.js';
import MongoClient from '../daos/MongoClient.js'

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Configuracion de Commander
const program = new Command();
program
    .option('--mode <mode>', 'Puerto', 'prod')
    .option('--database <database>', 'Base de Datos', 'atlas')
program.parse();

import loggers from './logger.js'
//Server Up
const port = program.opts().mode === 'prod' ? config.ports.prodPort : config.ports.devPort;
const httpServer = app.listen(port, () => loggers.info(`Server Up! => http://localhost:${port}`))
const socketServer = new Server(httpServer)

// Conexión a la base de datos
let client = new MongoClient()
client.connect()

// Passport Github
import initializePassportGH from '../middlewares/passportGithub.js';
initializePassportGH();

// Passport Local
import initializePassport from '../middlewares/passport.js';
initializePassport();

// Obtener los valores de las variables de entorno
const mongoConnection = config.db.mongo_connection;
const mongoDatabase = config.db.mongo_database;

// Configurar el middleware express-session con MongoStore 
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

// Inicializa Passport y lo usa en la aplicación
app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride('_method'));

// Configurar Handlebars como motor de plantillas
const handlebarsOptions = {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
};

app.engine(
    'handlebars',
    exphbs.engine({
        defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
    })
);

// Configuración de middleware
app.use(cookieParser());

// Configuracion de Handlebars
app.set('view engine', 'handlebars');

// Configuracion de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuracion de los metodos de envio de formulario
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Configuracion de las Rutas y las Vistas Principales
import views from './views.js';
app.use(express.static(path.resolve('..', 'public')));
app.set('views', '../views/');

function setupRoutes(app, routes) {
    routes.forEach((route) => {
        const { path, router } = route;
        app.use(path, router);
    });
}
setupRoutes(app, views);

// Error 404
import { loggermid } from './utils.js'
app.use(loggermid)

app.get('*', (req, res) => {
    loggers.fatal('Intentaron ingresar a una Pagina No Existente.!! => Error 404')
    const user = getUserFromToken(req);
    (!user) ? res.status(404).render('error/error404') :
        res.status(404).render('error/error404', { user });
});

// Configuracion de Cors
import cors from 'cors';
app.use(cors())

//Chat Socket
import chatApp from './chat.app.js';
chatApp(socketServer);