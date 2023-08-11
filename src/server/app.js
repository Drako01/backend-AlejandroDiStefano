import express from 'express';
import { Server } from 'socket.io';
import config from '../config/config.js';
import compression from 'express-compression';
import errorHandler from '../middlewares/error.middleware.js'
import customError from '../services/error.log.js'
import loggers from '../config/logger.js'

const app = express();

// Configuracion de Compresion de Archivos Estaticos con Brotli
app.use(compression({
    brotli: { enabled: true, zlib: {} }
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

let dominio = program.opts().mode === 'local' ? config.urls.urlProd : config.urls.urlLocal;
const port = program.opts().mode === 'prod' ? config.ports.prodPort : config.ports.devPort;

// Conexión a la base de datos
import MongoClient from '../daos/mongo/mongo.client.dao.js'
let client = new MongoClient()


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

import { getUserFromToken } from '../middlewares/user.middleware.js';
// Excepción para la ruta /docs/
app.use('/docs', (req, res, next) => next());


const swaggerUrl = ['/docs', '/docs/', '/docs/swagger-ui.css', '/docs/swagger-ui-init.js', '/docs/swagger-ui-bundle.js', '/docs/swagger-ui-standalone-preset.js', '/docs/favicon-32x32.png', '/docs/favicon-16x16.png'];

// Error 404
import { loggermid } from '../config/utils.js'
app.use(loggermid)

function validateSwaggerRoutes(req, res, next) {
    const requestedPath = req.path;
    if (swaggerUrl.includes(requestedPath)) {
        next();
    } else {
        let message = `Intentaron ingresar a una Pagina No Existente.!! - Error 404 | Método: ${req.method} en la URL: ${dominio}:${port}${req.url}`
        customError(new Error(message));
        const user = getUserFromToken(req);
        (!user) ? res.status(404).render('error/error404') : res.status(404).render('error/error404', { user });
    }
}
app.use(validateSwaggerRoutes);

// Configuracion de Cors
import cors from 'cors';
app.use(cors())


// Test de Logger para probar todos los niveles de logs
// import loggerTest from '../test/logger.test.js';
// loggerTest();


// Configuracion de Swagger
import swaggerUiExpress from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from '../manager/swagger.manager.js';
import chatApp from '../config/chat.app.js';
import EErros from '../services/errors/enums.js';
import CustomError from '../services/errors/custom_error.js';
import { findInactiveUsers } from '../manager/inactive-users.manager.js';

const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


//Server Up


function startServer() {
    const httpServer = app.listen(port, () => {
        loggers.http(`Server Up! => ${dominio}:${port}`);
        loggers.http('Documentación de API con Swagger => ' + swaggerOptions.definition.servers[0].url + '/docs-api');
        client.connect()
        findInactiveUsers()
    });

    const socketServer = new Server(httpServer);
    //Chat Socket
    chatApp(socketServer);
}


// Llamado a la funcion para eliminar usuarios inactivos
// Cada vez que se inicia el servidor se eliminan los usuarios inactivos
import { deleteInactiveUsersController } from '../controllers/user.controller.js';
deleteInactiveUsersController()
    .then(() => {
        loggers.info('Usuarios Inactivos Eliminados');
    })
    .catch((error) => {
        loggers.error(error.message);
    });


// Verificar si el puerto está en uso antes de iniciar el servidor
import net from 'net';
const serverTester = net.createServer();

serverTester.once('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        let message
        const error = new CustomError(
            'Error de Puerto en Uso',
            message,
            `Error al intentar iniciar el Servidor porque el puerto ${port} está en uso por otro proceso.!`,
            EErros.EADDRINUSE
        );
        customError(error);
        loggers.fatal(error.message);        
    } else {
        loggers.error('Error starting the server:', error);
    }
});

serverTester.once('listening', () => {
    serverTester.close();
    startServer();
});

serverTester.listen(port);
