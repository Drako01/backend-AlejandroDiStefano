import fs from 'fs';
import path from 'path';
import loggers from '../config/logger.js';



const logDirectory = path.join('../', 'logs');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}
const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour24: true,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat('es-AR', options);
    return formatter.format(date);
};

const customError = (error) => {
    const errorLog = {
        timestamp: formatDateTime(new Date()),
        error: error.message,
    };

    const errorLogPath = path.join(logDirectory, 'error.log');

    fs.appendFile(errorLogPath, JSON.stringify(errorLog) + '\n', (error) => {
        if (error) {
            loggers.error('Error writing to error log:', error);
        }
    });
};

export default customError;
