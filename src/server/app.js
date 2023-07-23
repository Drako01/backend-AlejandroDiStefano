import express from 'express';
import { Server } from 'socket.io';
import config from '../config/config.js';
import compression from 'express-compression';
import errorHandler from '../middlewares/error.middleware.js'

const app = express();


// Configuracion de Compresion de Archivos Estaticos con Brotli
app.use(compression({
    brotli:{enabled: true, zlib:{}}
}))

// Configuracion de Path
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Configuracion de Commander
import { Command } from 'commander';
const program = new Command();
program
    .option('--mode <mode>', 'Puerto', 'prod')
    .option('--database <database>', 'Base de Datos', 'atlas')
program.parse();

//Server Up
import loggers from '../config/logger.js'
let dominio = program.opts().mode === 'local' ? config.urls.urlProd : config.urls.urlLocal;
const port = program.opts().mode === 'prod' ? config.ports.prodPort : config.ports.devPort;
const httpServer = app.listen(port, () => loggers.info(`Server Up! => ${dominio}:${port}`))
const socketServer = new Server(httpServer)

// Conexión a la base de datos
import MongoClient from '../daos/mongo/mongo.client.dao.js'
let client = new MongoClient()
client.connect()

// Passport Github
import initializePassportGH from '../middlewares/github.middleware.js';
initializePassportGH();

// Passport Local
import initializePassport from '../middlewares/passport.middleware.js';
initializePassport();

// Configurar el middleware express-session con MongoStore
import configureSession from '../manager/express-sessions.manager.js';
configureSession(app);

// Inicializa Passport y lo usa en la aplicación
import passport from 'passport';
app.use(passport.initialize());
app.use(passport.session());

// Configuracion de Method Override
import methodOverride from 'method-override';
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

//  Configuracion de Handlebars
import configureHandlebars from '../manager/handlebars.manager.js';
import { registerHandlebarsHelpers } from '../helpers/handlebars.helpers.js';
registerHandlebarsHelpers(app)
configureHandlebars(app);

// Configuración de middleware
import cookieParser from 'cookie-parser';
app.use(cookieParser());

// Configuracion de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuracion de las Rutas y las Vistas Principales
import views from '../manager/views.manager.js';
app.use(express.static(path.resolve('..', 'public')));
app.set('views', '../views/');
app.use(errorHandler)

function setupRoutes(app, routes) {
    routes.forEach((route) => {
        const { path, router } = route;
        app.use(path, router);
    });
}
setupRoutes(app, views);

// Error 404
import { loggermid } from '../config/utils.js'
app.use(loggermid)

import { getUserFromToken } from '../middlewares/user.middleware.js';
app.get('*', (req, res) => {
    loggers.error(`Intentaron ingresar a una Pagina No Existente.!! 
        Error 404 | Método: ${req.method} en la URL: ${dominio}:${port}${req.url}`)
    const user = getUserFromToken(req);
    (!user) ? res.status(404).render('error/error404') :
        res.status(404).render('error/error404', { user });
});

// Configuracion de Cors
import cors from 'cors';
app.use(cors())

//Chat Socket
import chatApp from '../config/chat.app.js';
chatApp(socketServer);

// Test de Logger para probar todos los niveles de logs
// import loggerTest from '../test/logger.test.js';
// loggerTest();
