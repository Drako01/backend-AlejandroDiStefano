import { Router } from 'express';
import Cart from '../models/carts.model.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import Producto from '../models/products.model.js';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import twilio from 'twilio';
import config from '../server/config.js';
import loggers from '../server/logger.js'
const router = Router();

const urlActual = config.urls.urlLocal;
const twilioNumberPhone = config.twilio.numberPhone;
const twilioAccountSid = config.twilio.accountSid;
const twilioAuthToken = config.twilio.authToken;

// Configuración de transporte para el envío de correos electrónicos
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmail.user,
        pass: config.gmail.pass,
    },
});

// Configuración de Twilio
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);
const port = config.ports.prodPort || '';
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
                intro: 'Su compra en Lonne Open se ha realizado exitosamente. A continuación se muestran los detalles de la misma:',
                table: {
                    data: cart.items.map((item) => ({
                        Imagen: `<img src="cid:${item.producto.thumbnail}@lonneopen.com" alt="${item.producto.title}" width="60">`,
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
        const attachments = cart.items.reduce((acc, item) => {
            const attachment = {
                filename: item.producto.thumbnail,
                path: `${urlActual}:${port}${item.producto.thumbnail}`,
                cid: `${item.producto.thumbnail}@lonneopen.com`
            };
            acc.push(attachment);
            return acc;
        }, []);

        const mailOptions = {
            from: 'Ventas Lonne Open <addistefano76@gmail.com>',
            to: userEmail,
            subject: 'Confirmación de compra en Lonne Open',
            html: emailBody,
            attachments: [
                {
                    filename: 'logo.webp',
                    path: 'https://lonneopen.com/img/logo.webp',
                    cid: 'logo@lonneopen.com',
                },
                {
                    filename: '116356.png',
                    path: 'https://cdn-icons-png.flaticon.com/512/116/116356.png',
                    cid: 'carrito@lonneopen.com',
                },
                ...attachments
            ],
        };

        await transporter.sendMail(mailOptions);

        // Reducción del stock después de enviar el correo
        for (const item of cart.items) {
            try {
                const product = await Producto.findById(item.producto._id);
                if (!product) {
                    loggers.warning(`Producto no encontrado con el id: ${item.producto._id}`);
                    continue;
                }

                const newStock = product.stock - item.cantidad;
                if (newStock < 0) {
                    loggers.warning(`No hay suficiente stock para el producto: ${product.title}`);
                    continue;
                }

                product.stock = newStock;
                await product.save();
            } catch (err) {
                loggers.error('Error al actualizar el stock', err);
            }
        }
    } catch (err) {
        loggers.error('Error al enviar el correo electrónico', err);
    }
};


// Función para enviar un SMS utilizando Twilio
const sendSMS = async (userPhone) => {
    try {        
        const message = `El usuario con el número de celular: ${userPhone} acaba de realizar una compra en Lonne Open.`;       
        
        await twilioClient.messages.create({
            body: message,
            from: twilioNumberPhone,
            to: config.twilio.myPhone,
        });
    } catch (err) {
        loggers.error('Error al enviar el SMS', err);
    }
};

// Endpoint para mostrar el carrito de compras
router.get('/', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        const cart = await Cart.findOne({ user: { email: user.email || user.user.email } }).populate('items.producto');

        if (!cart) {
            res.status(404).render('error/error404', { user });
            return;
        }

        const totalPrice = cart.items.reduce((total, item) => total + (item.producto.price * item.cantidad), 0);

        res.render('checkout', { cart, code: cart.code, purchaseDatetime: cart.purchase_datetime, totalPrice, user });
    } catch (err) {
        loggers.error(err);
        res.status(500).render('Error al procesar la compra');
    }
});

router.post('/', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        const cart = await Cart.findOne({ user: { email: user.email || user.user.email } }).populate('items.producto');

        if (!cart) {
            res.status(404).render('error/error404', { user });
            return;
        }

        // Crear un nuevo array con los productos que tienen stock suficiente
        const productsWithSufficientStock = [];

        // Checkear el stock de cada producto en el carrito
        for (const item of cart.items) {
            try {
                const product = await Producto.findById(item.producto._id);
                if (!product) {
                    loggers.warning(`Producto no encontrado con el id: ${item.producto._id}`);
                    continue;
                }

                const newStock = product.stock - item.cantidad;
                if (newStock >= 0) {
                    // Si hay stock suficiente, agregar el producto al nuevo array y actualizar el stock
                    productsWithSufficientStock.push(item);
                    product.stock = newStock;
                    await product.save();
                } else {
                    // Si no hay stock suficiente, mostrar un mensaje de error y actualizar el stock
                    loggers.warning(`El producto: ${product.title} esta fuera de stock.!`);
                    product.stock += (item.cantidad - product.stock);
                    await product.save();
                }
            } catch (err) {
                loggers.error('Error al actualizar el stock', err);
            }
        }

        // Actualizar el carrito con los productos que tienen stock suficiente
        cart.items = productsWithSufficientStock;

        // Chequear si quedaron productos en el carrito
        if (cart.items.length === 0) {
            // Error: no hay stock suficiente para ninguno de los productos del carrito
            res.render('error/notStock', { user, products: cart.items.map((item) => item.producto) });
            return;
        }

        // Enviar el correo electrónico de confirmación de compra
        await sendPurchaseConfirmationEmail(user.email || user.user.email, cart, user);
        // await sendSMS(user.phone); // Descomentar para enviar un SMS

        const totalPrice = cart.items.reduce((total, item) => total + (item.producto.price * item.cantidad), 0);
        res.render('checkout', { cart, code: cart.code, purchaseDatetime: cart.purchase_datetime, totalPrice, user });
    } catch (err) {
        loggers.error(err);
        res.status(500).render('Error al procesar la compra');
    }
});


export default router;
