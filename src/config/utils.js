import winston from "winston";
import config from "./config.js";

const swaggerUrls = [
    '/docs',
    '/docs/',
    '/docs/swagger-ui.css',
    '/docs/swagger-ui-init.js',
    '/docs/swagger-ui-bundle.js',
    '/docs/swagger-ui-standalone-preset.js',
    '/docs/favicon-32x32.png',
    '/docs/favicon-16x16.png',
    '/docs/index.html',
    '/docs/*',
];

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'http', format: winston.format.json() }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'warn',
            format: winston.format.json()
        })
    ]
});

export const loggermid = (req, res, next) => {
    req.logger = logger;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('es-AR');
    const dominio = config.urls.urlLocal 
    const port = config.ports.prodPort;
    const message = `Método ${req.method} en la URL: ${dominio}:${port}${req.url} - ${formattedDate} - ${formattedTime}`   

    const requestedPath = req.path;
    if (!swaggerUrls.includes(requestedPath)) {
        logger.error(`Este es un mensaje customisado: ${message}`);
    }
    next();
};
