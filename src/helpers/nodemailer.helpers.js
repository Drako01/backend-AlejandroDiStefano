import config from '../config/config.js';
import loggers from '../config/logger.js'
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import Producto from '../daos/models/products.model.js';
import customError from '../services/error.log.js';
const urlActual = config.urls.urlLocal;

// Configuración de transporte para el envío de correos electrónicos
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmail.user,
        pass: config.gmail.pass,
    },
});
const port = config.ports.prodPort || '';
export const sendPurchaseConfirmationEmail = async (userEmail, cart, user) => {
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
                customError(err);
                loggers.error('Error al actualizar el stock');
            }
        }
    } catch (err) {
        customError(err);
        loggers.error('Error al enviar el correo electrónico');
    }
};