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

