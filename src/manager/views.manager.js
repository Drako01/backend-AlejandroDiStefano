// Rutas
import productRouter from '../controllers/products.router.js';
import productsEditRouter from '../controllers/productseditid.router.js';
import productsdeletebyidRouter from '../controllers/productsdeletebyid.router.js';
import productsIdRouter from '../controllers/productsid.router.js';
import productsTableRouter from '../controllers/productstable.router.js';
import cartRouter from '../controllers/carts.router.js';
import cartDeleteByIdRouter from '../controllers/cartsDeleteById.router.js';
import indexRouter from '../controllers/index.router.js';
import chatRouter from '../controllers/chat.router.js';
import productsInRealTimeRouter from '../controllers/productsInRealTime.js';
import productsEditByIdRouter from '../controllers/productseditbyid.router.js';
import loginRouter from '../controllers/login.router.js';
import loginGithubRouter from '../controllers/logingithub.router.js';
import singupRouter from '../controllers/signup.router.js';
import logoutRouter from '../controllers/logout.router.js';
import checkoutRouter from '../controllers/checkout.router.js';
import usersRouter from '../controllers/users.router.js';
import signupAdminRouter from '../controllers/signupadmin.router.js';
import admin_panel from '../controllers/adminPanel.router.js';

// Vistas
const views = [
    { path: '/', router: indexRouter },
    { path: '/products', router: productRouter },
    { path: '/productstable', router: productsTableRouter },
    { path: '/productsdeletebyid', router: productsdeletebyidRouter },
    { path: '/productsedit', router: productsEditRouter },
    { path: '/productseditbyid', router: productsEditByIdRouter },
    { path: '/productsid', router: productsIdRouter },
    { path: '/carts', router: cartRouter },
    { path: '/chat', router: chatRouter },
    { path: '/login', router: loginRouter },
    { path: '/signup', router: singupRouter },
    { path: '/logout', router: logoutRouter },
    { path: '/realTimeProducts', router: productsInRealTimeRouter },
    { path: '/cartsDeleteById', router: cartDeleteByIdRouter },
    { path: '/checkout', router: checkoutRouter },
    { path: '/users', router: usersRouter },
    { path: '/signupadmin', router: signupAdminRouter },
    { path: '/github', router: loginGithubRouter },
    { path: '/admin_panel', router: admin_panel },
];

export default views;

