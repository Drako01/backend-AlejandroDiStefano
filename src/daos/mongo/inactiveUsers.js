import customError from '../../services/error.log.js';
import { UserService } from '../../repositories/index.js';
import loggers from '../../config/logger.js';

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
        inactiveUsers.forEach((user) => {
            if (user.updatedAt < oneYearAgo) {
                const formattedDate = formatDate(user.updatedAt);
                loggers.info(`Usuario inactivo: ${user.first_name || user.user.first_name} ${user.last_name}- Último inicio de sesión: ${formattedDate} | Hace más de un año que no se conecta.!!`);
            }
        });
    } catch (error) {
        customError(error);
        loggers.error('Error al buscar usuarios inactivos:');        
    }
}