import EErros from "../services/errors/enums.js";
import logger from "../config/logger.js";

const swaggerUrls = [
    '/docs',
    '/docs/swagger-ui.css',
    '/docs/swagger-ui-init.js',
    '/docs/swagger-ui-bundle.js',
    '/docs/swagger-ui-standalone-preset.js',
    '/docs/favicon-32x32.png',
    '/docs/favicon-16x16.png',
    '/docs/index.html',
    '/docs/*',
];

export default (error, req, res, next) => {
    const requestedPath = req.path;
    if (swaggerUrls.includes(requestedPath)) {
        logger.info('Swagger route: ' + requestedPath );
        next(); 
    } else {
        logger.error(error.name);

        switch (error.code) {
            case EErros.INVALID_TYPES_ERROR:
                res.status(400).send({ status: 'error', error: error.cause });
                break;
            default:
                res.send({ status: 'error', error: 'Unhandled error' });
                break;
        }
    }
};
