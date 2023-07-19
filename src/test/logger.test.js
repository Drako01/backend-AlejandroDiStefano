import loggers from '../server/logger.js';


// Inicio de las pruebas
export default function loggerTest() {
    loggers.debug('Esto es un mensaje de depuración');
    loggers.http('Esto es un mensaje de solicitud HTTP');
    loggers.info('Esto es un mensaje de información');
    loggers.notice('Esto es un mensaje de notificación');
    loggers.warning('Esto es un mensaje de advertencia');
    loggers.error('Esto es un mensaje de error');
    loggers.fatal('Esto es un mensaje de error fatal');

    // Fin de las pruebas
    console.log('Pruebas de logs finalizadas');
}
