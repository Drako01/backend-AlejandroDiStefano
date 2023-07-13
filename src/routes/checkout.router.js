import { Router } from 'express';
import Cart from '../models/carts.model.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

const router = Router();

// Configuración de transporte para el envío de correos electrónicos
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'addistefano76@gmail.com',
        pass: process.env.GOOGLE_PASS,
    },
});

// Función para generar y enviar el correo electrónico de confirmación de compra
const sendPurchaseConfirmationEmail = async (userEmail, cart, user) => {
    try {
        const mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Lonne Open',
                link: {
                    href: 'https://www.lonneopen.com/',
                    image: 'cid:logo@lonneopen.com',
                    width: 60,
                    alt: 'Lonne Open Logo',
                },
            },
        });

        const totalPrice = cart.items.reduce((total, item) => total + (item.producto.price * item.cantidad), 0);

        const emailContent = {
            body: {
                greeting: `Hola ${user.email || user.user.email}`,
                intro: 'Su compra en Lonne Open se ha realizado exitosamente. A continuación se muestran los detalles de la compra:',
                table: {
                    data: cart.items.map((item) => ({
                        Imagen: `<img src="cid:logo@lonneopen.com" alt="${item.producto.title}" width="30">`,
                        Nombre: item.producto.title,                        
                        Cantidad: item.cantidad,
                        Subtotal: `$ ${item.producto.price}.-`,
                    })),
                    columns: {
                        Imagen: 'Imagen',
                        Nombre: 'Nombre del producto',                        
                        Cantidad: 'Cantidad',
                        Subtotal: 'Precio',
                    },
                },
                outro: [
                    `Precio total: $ ${totalPrice}.-`,
                    `Código de compra: ${cart.code}`,
                    `Fecha y hora de compra: ${cart.purchase_datetime}`,
                    `<img src="cid:logo@lonneopen.com" alt="Lonne Open" width="60">`,
                ],
            },
        };

        const emailBody = mailGenerator.generate(emailContent);
        const mailOptions = {
            from: 'Ventas Lonne Open | <addistefano76@gmail.com>',
            to: userEmail,
            subject: 'Confirmación de compra en Lonne Open',
            html: emailBody,
            attachments: [
                {
                    filename: 'logo.webp',
                    path: 'https://lonneopen.com/img/logo.webp',
                    cid: 'logo@lonneopen.com',
                },
            ],
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('Error al enviar el correo electrónico', err);
    }
};

router.get('/', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        const cart = await Cart.findOne({ user: { email: user.email || user.user.email } }).populate('items.producto');

        if (!cart) {
            res.status(404).send('No se encontró un carrito para el usuario');
            return;
        }

        const totalPrice = cart.items.reduce((total, item) => total + (item.producto.price * item.cantidad), 0);

        res.render('checkout', { cart, code: cart.code, purchaseDatetime: cart.purchase_datetime, totalPrice, user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al procesar la compra');
    }
});

router.post('/', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        const cart = await Cart.findOne({ user: { email: user.email || user.user.email } }).populate('items.producto');

        if (!cart) {
            res.status(404).send('No se encontró un carrito para el usuario');
            return;
        }

        await sendPurchaseConfirmationEmail(user.email || user.user.email, cart, user);
        const totalPrice = cart.items.reduce((total, item) => total + (item.producto.price * item.cantidad), 0);
        res.render('checkout', { cart, code: cart.code, purchaseDatetime: cart.purchase_datetime, totalPrice, user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al procesar la compra');
    }
});

export default router;
