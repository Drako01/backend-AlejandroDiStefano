import multer from 'multer';
import path from 'path';
import loggers from '../config/logger.js';
import __dirname from '../server/utils.js';
import customError from '../services/error.log.js';

const configureMulter = (destinationPath) => {
    try {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path.join(__dirname, '..', 'public', destinationPath));
            },
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                const filename = file.fieldname + '-' + Date.now() + ext;
                cb(null, filename);
            },
        });

        const upload = multer({ storage });

        return upload;
    } catch (error) {
        customError(error);
        loggers.error('Error en la configuración de Multer', error);        
    }
};

export default configureMulter;
