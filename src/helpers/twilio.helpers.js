import twilio from 'twilio';
import config from '../config/config.js';
import loggers from '../config/logger.js'
import customError from '../services/error.log.js';

// Configuración de Twilio
const twilioNumberPhone = config.twilio.numberPhone;
const twilioAccountSid = config.twilio.accountSid;
const twilioAuthToken = config.twilio.authToken;

// Configuración de Twilio
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

// Función para enviar un SMS utilizando Twilio
export const sendSMS = async (userPhone) => {
    try {        
        const message = `El usuario con el número de celular: ${userPhone} acaba de realizar una compra en Lonne Open.`;       
        
        await twilioClient.messages.create({
            body: message,
            from: twilioNumberPhone,
            to: config.twilio.myPhone,
        });
    } catch (err) {
        customError(err);
        loggers.error('Error al enviar el SMS');
    }
};
