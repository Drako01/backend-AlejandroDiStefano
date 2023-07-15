import winston from "winston";

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'http' }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'warn'
        })
    ]
})

export const loggermid = (req, res, next) => {
    req.logger = logger
    req.logger.error(`${req.method} on ${req.url} - ${new Date().toLocaleTimeString() }`)
    next()
}