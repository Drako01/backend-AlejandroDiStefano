import winston from "winston";

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
    const message = {
        level: 'error',
        message: `${req.method} on ${req.url} - ${formattedDate} - ${formattedTime}`
    };
    req.logger.error(message);
    next();
};
