// Rutas
import productRouter from '../routers/products.router.js';
import mockingproductsRouter from '../routers/mockingproducts.router.js';
import productsEditRouter from '../routers/productseditid.router.js';
import productsdeletebyidRouter from '../routers/products.admin.router.js';
import productsTableRouter from '../routers/productstable.router.js';
import cartRouter from '../routers/carts.router.js';
import indexRouter from '../routers/index.router.js';
import chatRouter from '../routers/chat.router.js';
import productsInRealTimeRouter from '../routers/productsInRealTime.router.js';
import productsEditByIdRouter from '../routers/products.admin.router.js';
import loginRouter from '../routers/login.router.js';
import loginGithubRouter from '../routers/logingithub.router.js';
import singupRouter from '../routers/signup.router.js';
import logoutRouter from '../routers/logout.router.js';
import checkoutRouter from '../routers/checkout.router.js';
import usersRouter from '../routers/users.router.js';
import usersPremiumRouter from '../routers/premium.user.router.js';
import signupAdminRouter from '../routers/signupadmin.router.js';
import admin_panel from '../routers/products.admin.router.js';
import forgotPassword from '../routers/forgot-password.js';
import resetPassword from '../routers/reset-password.router.js';
import documentRouter from '../routers/docs.router.js';

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
    { path: '/cartsDeleteById', router: cartRouter },
    { path: '/checkout', router: checkoutRouter },
    { path: '/users', router: usersRouter },
    { path: '/users/newUser', router: usersRouter },
    { path: '/users/profile', router: usersRouter },
    { path: '/signupadmin', router: signupAdminRouter },
    { path: '/github', router: loginGithubRouter },
    { path: '/admin_panel', router: admin_panel },
    { path: '/forgot-password', router: forgotPassword },
    { path: '/reset-password', router: resetPassword },    
    { path: '/docs-api', router: documentRouter },  
    { path: '/users/profile/documents', router: usersPremiumRouter },
    { path: '/users/my-documents', router: usersRouter },
    { path: '/users/premium', router: usersRouter },
];

export default views;

