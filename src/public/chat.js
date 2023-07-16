import loggers from '../server/logger.js'

fetch('/chat')
    .then(response => response.json())
    .then(messages => {

        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.innerText = `${message.user}: ${message.message}`;
            history.appendChild(messageElement);
        });
    })
    .catch(err => loggers.error(err));


chatBox.addEventListener('keyup', event => {
    if (event.keyCode === 13) {
        const user = username.innerText;
        const message = chatBox.value;

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user, message })
        })
            .then(response => {
                if (response.ok) {

                    const messageElement = document.createElement('div');
                    messageElement.innerText = `${user}: ${message}`;
                    history.appendChild(messageElement);
                    chatBox.value = '';
                } else {
                    loggers.error('Error al enviar el mensaje');
                }
            })
            .catch(err => loggers.error(err));
    }
});