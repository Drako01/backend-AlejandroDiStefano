import winston from 'winston'
import config from './config.js'
import dotenv from 'dotenv'
dotenv.config()

const customWinstonOptions = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        debug: 'white',
        http: 'green',
        info: 'blue',
        warning: 'yellow',
        error: 'orange',
        fatal: 'red'
    }
}

winston.addColors(customWinstonOptions.colors)

const createLogger = env => {
    if (env === 'PROD') {
        return winston.createLogger({
            levels: customWinstonOptions.levels,
            level: 'fatal',
            transports: [
                new winston.transports.File({
                    filename: './errors.log',
                    format: winston.format.simple()
                })
            ]
        })
    } else {
        return winston.createLogger({
            levels: customWinstonOptions.levels,
            level: 'fatal',
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            ]
        })
    }
}

const loggers = createLogger(config.log.level)

export default loggers