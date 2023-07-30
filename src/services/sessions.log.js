import fs from 'fs';
import path from 'path';
import loggers from '../config/logger.js';
import customError from './error.log.js';

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

const customMessageSessions = (message) => {
    const sessionLog = {
        timestamp: formatDateTime(new Date()),
        message: message,
    };

    const sessionLogPath = path.join(logDirectory, 'session.log');

    fs.appendFile(sessionLogPath, JSON.stringify(sessionLog) + '\n', (error) => {
        if (error) {
            customError(error);
            loggers.error('Error writing to session log');
        }
    });
};

export default customMessageSessions;
