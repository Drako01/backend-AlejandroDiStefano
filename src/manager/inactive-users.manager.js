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
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    try {
        const inactiveUsers = await UserService.getAll();
        console.log('\n') // Salto de linea insertado para que se vea mejor en la consola
        loggers.notice('Lista de usuarios: ')
        inactiveUsers.forEach((user) => {
            let users = new UserDTO(user);
            
            if (user.updatedAt < oneYearAgo) {
                const formattedDate = formatDate(user.updatedAt);
                let messageA = `Usuario inactivo: ${users.full_name} | Último inicio de sesión: ${formattedDate} | Hace más de un año que no se conecta.!!`
                customMessageSessions(messageA)
                loggers.warn(messageA);
            } else {
                let messageB = `Usuario activo: ${users.full_name}`
                customMessageSessions(messageB)
                loggers.info(messageB);
            }
        });
    } catch (error) {
        customError(error);
        loggers.error('Error al buscar usuarios inactivos:');
    }
}