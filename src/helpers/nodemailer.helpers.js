import config from '../config/config.js';
import loggers from '../config/logger.js'
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import { ProductService } from '../repositories/index.js';
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
                const product = await ProductService.getById(item.producto._id);
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

// Avisar al usuario que sus productos fueron eliminados del carrito por falta de stock
export const sendDeleteProductsEmail = async (usermail, cart) => {
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

        const emailContent = {
            body: {
                greeting: `Hola ${usermail}`,
                intro: 'Lamentamos comunicarle que algunos productos en su compra en Lonne Open han sido eliminados del carrito debido a falta de stock. Enviamos el código de la compra:',
                
                outro: [
                    `Código de compra: ${cart.code}`,
                    `Fecha y hora de compra: ${cart.purchase_datetime}`,
                    `<img src="cid:logo@lonneopen.com" alt="Lonne Open" width="60">`,
                ],
            },
        };

        const emailBody = mailGenerator.generate(emailContent);        

        const mailOptions = {
            from: 'Ventas Lonne Open <addistefano76@gmail.com>',
            to: usermail,
            subject: 'Actualización de compra en Lonne Open',
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
            ],
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        customError(err);
        loggers.error('Error al enviar el correo electrónico', err);        
    }
};

export const sendWellcomeUser = async (usermail) => {
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

        const emailContent = {
            body: {
                greeting: `¡Bienvenido/a  ${usermail} a Lonne Open!`,
                intro: 'Gracias por unirte a nuestra comunidad. En Lonne Open encontrarás una amplia variedad de productos y ofertas especiales. ¡Esperamos que disfrutes de tu experiencia de compra con nosotros!',

                outro: [
                    'Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.',
                    `Correo de contacto: ventas@lonneopen.com`,
                    `<img src="cid:logo@lonneopen.com" alt="Lonne Open" width="60">`,
                ],
            },
        };

        const emailBody = mailGenerator.generate(emailContent);

        const mailOptions = {
            from: 'Ventas Lonne Open <addistefano76@gmail.com>',
            to: usermail,
            subject: '¡Bienvenido/a a Lonne Open!',
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
            ],
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        customError(err);
        loggers.error('Error al enviar el correo electrónico', err);
    }
};

// Avisar al usuario que su cuenta fue cerrada
export const sendCloseAccountEmail = async (usermail) => {
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

        const emailContent = {
            body: {
                greeting: `Hola ${usermail}`,
                intro: 'Lamentamos informarte que tu cuenta en Lonne Open ha sido cerrada.',

                outro: [
                    'Si crees que esto fue un error o necesitas más información, por favor contáctanos.',
                    `Correo de contacto: ventas@lonneopen.com`,
                    `<img src="cid:logo@lonneopen.com" alt="Lonne Open" width="60">`,
                ],
            },
        };

        const emailBody = mailGenerator.generate(emailContent);

        const mailOptions = {
            from: 'Ventas Lonne Open <addistefano76@gmail.com>',
            to: usermail,
            subject: 'Cierre de cuenta en Lonne Open',
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
            ],
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        customError(err);
        loggers.error('Error al enviar el correo electrónico', err);
    }
};

// Avisar al usuario que genere un nuevo password (Esto es para mas adelante) NO SE USA EN ESTE PROYECTO
export const sendResetPasswordEmail = async (usermail, token) => {
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

        const resetLink = `https://www.lonneopen.com/reset-password/${token}`;

        const emailContent = {
            body: {
                greeting: `Hola ${usermail}`,
                intro: 'Recibimos una solicitud para restablecer la contraseña de tu cuenta en Lonne Open. Si no realizaste esta solicitud, puedes ignorar este correo.',

                action: {
                    instructions: 'Si deseas restablecer tu contraseña, haz clic en el siguiente botón:',
                    button: {
                        text: 'Restablecer contraseña',
                        link: resetLink,
                    },
                },

                outro: [
                    'Si necesitas ayuda o tienes alguna pregunta, no dudes en contactarnos.',
                    `Correo de contacto: ventas@lonneopen.com`,
                    `<img src="cid:logo@lonneopen.com" alt="Lonne Open" width="60">`,
                ],
            },
        };

        const emailBody = mailGenerator.generate(emailContent);

        const mailOptions = {
            from: 'Ventas Lonne Open <addistefano76@gmail.com>',
            to: usermail,
            subject: 'Restablecer contraseña en Lonne Open',
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
            ],
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        customError(err);
        loggers.error('Error al enviar el correo electrónico', err);
    }
};