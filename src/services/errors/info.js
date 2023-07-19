export const generateUserErrorInfo = user => {
    const requiredProperties = [
        { name: 'first_name', value: user.first_name },
        { name: 'last_name', value: user.last_name },
        { name: 'email', value: user.email }
    ];

    const errorInfo = requiredProperties
        .filter(prop => !prop.value)
        .map(prop => `- ${prop.name}: Falta completar el campo`);

    return `
        Uno o más campos están incompletos o no son válidos.
        Lista de campos obligatorios:
        ${errorInfo.join('\n')}
    `;
};

export const errorMessagesProductosMocking = {
    invalidFields: 'Uno o más campos son inválidos.',
    missingFields: 'Uno o más campos son obligatorios y no fueron proporcionados.',
    notFound: 'El recurso solicitado no fue encontrado.',
    internalServerError: 'Error interno del servidor.'
};
