import fs from 'fs';
import path from 'path';
import loggers from '../../config/logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const logDirectory = path.join(__dirname, 'logs');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}


const customError = (error) => {
    const errorLog = {
        timestamp: new Date(),
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
