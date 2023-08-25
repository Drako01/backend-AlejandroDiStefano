import customError from '../services/error.log.js';
import { UserService } from '../repositories/index.js';
import loggers from '../config/logger.js';
import UserDTO from '../dtos/user.dto.js';
import customMessageSessions from '../services/sessions.log.js'

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export async function findInactiveUsers() {
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);
    
    try {
        const inactiveUsers = await UserService.getAll();
        console.log('\n'); // Salto de línea insertado para mejor legibilidad en la consola
        loggers.notice('Lista de usuarios: ');
        inactiveUsers.forEach((user) => {
            let users = new UserDTO(user);
            
            if (user.updatedAt < fortyEightHoursAgo) {
                const formattedDate = formatDate(user.updatedAt);
                let messageA = `Usuario inactivo: ${users.full_name} | Último inicio de sesión: ${formattedDate} | No ha iniciado sesión en las últimas 48 horas.`
                customMessageSessions(messageA);
                loggers.warn(messageA);
            } else {
                let messageB = `Usuario activo: ${users.full_name}`;
                customMessageSessions(messageB);
                loggers.info(messageB);
            }
        });
    } catch (error) {
        customError(error);
        loggers.error('Error al buscar usuarios inactivos:');
    }
}
