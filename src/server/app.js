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

// Rutas
import productRouter from '../routes/products.router.js';
import productsEditRouter from '../routes/productseditid.router.js';
import productsdeletebyidRouter from '../routes/productsdeletebyid.router.js';
import productsIdRouter from '../routes/productsid.router.js';
import productsTableRouter from '../routes/productstable.router.js';
import cartRouter from '../routes/carts.router.js';
import cartDeleteByIdRouter from '../routes/cartsDeleteById.router.js';
import indexRouter from '../routes/index.router.js';
import chatRouter from '../routes/chat.router.js';
import productsInRealTimeRouter from '../routes/productsInRealTime.js';
import productsEditByIdRouter from '../routes/productseditbyid.router.js';
import loginRouter from '../routes/login.router.js';
import loginGithubRouter from '../routes/logingithub.router.js';
import singupRouter from '../routes/signup.router.js';
import logoutRouter from '../routes/logout.router.js';
import checkoutRouter from '../routes/checkout.router.js';
import usersRouter from '../routes/users.router.js';
import signupAdminRouter from '../routes/signupadmin.router.js';
import admin_panel from '../routes/adminPanel.router.js';


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



// Obtener los valores de las variables de entorno
const mongoConnection = config.db.mongo_connection;
const mongoDatabase = config.db.mongo_database;


// Conexión a la base de datos
let client = new MongoClient()
client.connect()


// Passport Github
import initializePassportGH from '../middlewares/passportGithub.js';
initializePassportGH();

// Passport Local
import initializePassport from '../middlewares/passport.js';
initializePassport();


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


// Configuracion de las Rutas Principales
app.use(express.static(path.resolve('..', 'public')));
app.set('views', '../views/');


// Vistas
app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/productstable', productsTableRouter);
app.use('/productsdeletebyid', productsdeletebyidRouter);
app.use('/productsedit', productsEditRouter);
app.use('/productseditbyid', productsEditByIdRouter);
app.use('/productsid', productsIdRouter);
app.use('/carts', cartRouter);
app.use('/chat', chatRouter);
app.use('/login', loginRouter);
app.use('/signup', singupRouter);
app.use('/logout', logoutRouter);
app.use('/realTimeProducts', productsInRealTimeRouter);
app.use('/cartsDeleteById', cartDeleteByIdRouter);
app.use('/checkout', checkoutRouter);
app.use('/users', usersRouter);
app.use('/signupadmin', signupAdminRouter);
app.use('/github', loginGithubRouter);
app.use('/admin_panel', admin_panel);

// Error 404
import { loggermid } from './utils.js'
app.use(loggermid)

app.get('*', (req, res) => {    
    loggers.fatal('Intentaron ingresar a una Pagina No Existente.!! => Error 404')       
    const user = getUserFromToken(req);    
    (!user) ? res.status(404).render('error/error404'):
    res.status(404).render('error/error404', { user }); 
});


// Configuracion de Cors
import cors from 'cors';
app.use(cors())

//Chat Socket
import chatApp from './chat.app.js';
chatApp(socketServer);