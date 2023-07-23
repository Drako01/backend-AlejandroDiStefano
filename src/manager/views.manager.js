// Rutas
import productRouter from '../routers/products.router.js';
import mockingproductsRouter from '../controllers/mockingproducts.controller.js';
import productsEditRouter from '../controllers/productseditid.controller.js';
import productsdeletebyidRouter from '../routers/products.admin.router.js';
import productsTableRouter from '../controllers/productstable.controller.js';
import cartRouter from '../routers/carts.router.js';
import cartDeleteByIdRouter from '../controllers/cartsDeleteById.controller.js';
import indexRouter from '../controllers/index.controller.js';
import chatRouter from '../routers/chat.router.js';
import productsInRealTimeRouter from '../controllers/productsInRealTime.controller.js';
import productsEditByIdRouter from '../routers/products.admin.router.js';
import loginRouter from '../routers/login.router.js';
import loginGithubRouter from '../routers/logingithub.router.js';
import singupRouter from '../routers/signup.router.js';
import logoutRouter from '../routers/logout.router.js';
import checkoutRouter from '../controllers/checkout.controller.js';
import usersRouter from '../controllers/users.controller.js';
import signupAdminRouter from '../routers/signupadmin.router.js';
import admin_panel from '../routers/products.admin.router.js';

// Vistas
const views = [
    { path: '/', router: indexRouter },
    { path: '/products', router: productRouter },
    { path: '/mockingproducts', router: mockingproductsRouter },
    { path: '/productstable', router: productsTableRouter },
    { path: '/productsdeletebyid', router: productsdeletebyidRouter },
    { path: '/productsedit', router: productsEditRouter },
    { path: '/productseditbyid', router: productsEditByIdRouter },
    { path: '/productsid', router: productRouter },
    { path: '/carts', router: cartRouter },
    { path: '/chat', router: chatRouter },
    { path: '/login', router: loginRouter },
    { path: '/signup', router: singupRouter },
    { path: '/logout', router: logoutRouter },
    { path: '/realTimeProducts', router: productsInRealTimeRouter },
    { path: '/cartsDeleteById', router: cartDeleteByIdRouter },
    { path: '/checkout', router: checkoutRouter },
    { path: '/users', router: usersRouter },
    { path: '/users/newUser', router: usersRouter },
    { path: '/users/profile', router: usersRouter },
    { path: '/signupadmin', router: signupAdminRouter },
    { path: '/github', router: loginGithubRouter },
    { path: '/admin_panel', router: admin_panel },
];

export default views;

