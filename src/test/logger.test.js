import loggers from '../server/logger.js';

export default function loggerTest() {
    console.log('\n')
    console.log('Inicio de las pruebas de logs')
    console.log('\n')
    loggers.debug('Esto es un mensaje de depuración');
    loggers.http('Esto es un mensaje de solicitud HTTP');
    loggers.info('Esto es un mensaje de información');
    loggers.notice('Esto es un mensaje de notificación');
    loggers.warning('Esto es un mensaje de advertencia');
    loggers.error('Esto es un mensaje de error');
    loggers.fatal('Esto es un mensaje de error fatal');
    
    console.log('\n')
    // Fin de las pruebas
    loggers.notice('Pruebas de logs finalizadas');
    console.log('\n')
}
