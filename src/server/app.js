import express from 'express';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import path from 'path';
import session from 'express-session';
import methodOverride from 'method-override';
import MongoStore from 'connect-mongo';
import exphbs from 'express-handlebars';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { Command } from 'commander';
import cors from 'cors';



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

// Cargar las variables de entorno
import dotenv from 'dotenv';
dotenv.config();

const prodPort = process.env.PROD_PORT;
const devPort = process.env.DEV_PORT;

const prodMongo = process.env.MONGO_CONNECTION;
const prodBD = process.env.MONGO_DATABASE;
const localBD = process.env.LOCAL_CONNECTION;
const localBDName = process.env.LOCAL_DATABASE;


// Verificar el valor de la opción --database
if (program.opts().database === 'atlas') {
    process.env.MONGO_CONNECTION = prodMongo;
    process.env.MONGO_DATABASE = prodBD;
} else {
    process.env.MONGO_CONNECTION = localBD;
    process.env.MONGO_DATABASE = localBDName;
}

//Server Up
const port = program.opts().mode === 'prod' ? prodPort : devPort;
const httpServer = app.listen(port, () => console.log(`Server Up en http://localhost:${port}`))
const socketServer = new Server(httpServer)


// Obtener los valores de las variables de entorno
const mongoConnection = process.env.MONGO_CONNECTION;
const mongoDatabase = process.env.MONGO_DATABASE;



async function connectToDatabase() {
    try {
        await mongoose.connect(mongoConnection);
        console.log(`Conexión exitosa a la base de datos "${mongoDatabase}"`);
    } catch (error) {
        console.log(`No se puede conectar a la Base de Datos ${mongoDatabase}. Error: ${error}`);
        process.exit();
    }
}

connectToDatabase();


// Passport Github
import initializePassportGH from '../middlewares/passportGithub.js';
initializePassportGH();

// Passport Local
import initializePassport from '../middlewares/passport.js';
initializePassport();


// Configurar el middleware express-session con MongoStore 
const secret = process.env.SECRET;
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


// Configurar el middleware express-flash
import flash from 'express-flash';
app.use(flash());


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
app.use((req, res) => {
    res.status(404).render('error/error404');
});
//

// Configuracion de Cors
app.use(cors())

//Chat Socket
import Messages from '../models/messages.model.js';

let log = []
let newproduct = []

socketServer.on('connection', (socketClient) => {
    let queryUser = socketClient.handshake.query.user;
    console.log(`Nuevo cliente "${queryUser}" conectado...`);


    socketClient.on('message', (data) => {
        console.log(`${data.user} Envió: ${data.message}`);
        log.push(data);
        socketClient.emit('history', log);
        socketClient.broadcast.emit('history', log);


        Messages.findOneAndUpdate({ user: data.user }, { $push: { message: data.message } }, { upsert: true })
            .then(() => {
                console.log(`El Mensaje de ${data.user} se guardó en el modelo`);
            })
            .catch(err => {
                console.error('Error al guardar el mensaje en el modelo:', err);
            });
    });


    socketClient.on('product', (dataProd) => {
        newproduct.push(dataProd);
        socketClient.emit('product-list', newproduct);
        socketClient.broadcast.emit('product-list', newproduct);
    });

    socketClient.broadcast.emit('newUser', queryUser);
});