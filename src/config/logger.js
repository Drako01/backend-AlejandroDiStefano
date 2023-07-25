import winston from 'winston'
import config from './config.js';


const customWinstonOptions = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        notice: 3,
        warn: 4,
        error: 5,
        fatal: 6,
    },
    colors: {
        debug: 'white',
        http: 'green',
        notice: 'cyan',
        info: 'blue',
        warn: 'yellow',
        error: 'red',
        fatal: 'magenta',
    }
}

winston.addColors(customWinstonOptions.colors)

const prod = config.log.level === 'PROD'

const createLogger = () => {
    if (prod) {
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