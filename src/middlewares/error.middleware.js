import EErros from "../services/errors/enums.js";
import logger from "../config/logger.js";

export default (error, req, res, next) => {
    logger.error(error.name);
    
    switch (error.code) {
        case EErros.INVALID_TYPES_ERROR:
            res.status(400).send({ status: 'error', error: error.cause });
            break;
        default:
            res.send({ status: 'error', error: 'Unhandled error' });
            break;
    }
};
