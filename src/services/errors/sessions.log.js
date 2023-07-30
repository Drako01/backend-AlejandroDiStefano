import fs from 'fs';
import path from 'path';
import loggers from '../../config/logger.js';
import { fileURLToPath } from 'url';
import customError from './error.log.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.join(__dirname, 'logs');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const customMessageSessions = (message) => {
    const sessionLog = {
        timestamp: new Date(),
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
