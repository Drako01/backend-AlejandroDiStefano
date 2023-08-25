const comprar = document.getElementById('comprar-carro')
const vaciar = document.getElementById('vaciar-carro')
const eliminar = document.getElementById('eliminar-carro')
const pagar = document.getElementById('pagar-carro')
const checkoutSection = document.getElementById('checkout-section')
const cardInputs = document.querySelectorAll('.card-form input');
const cardNumberInput = document.getElementById('card-number');
const cardNameInput = document.getElementById('card-name');
const cardExpirationInput = document.getElementById('card-expiration');
const cardCVVInput = document.getElementById('card-cvv');
const displayCardNumber = document.getElementById('display-card-number');
const displayCardName = document.getElementById('display-card-name');
const displayCardExpiration = document.getElementById('display-card-expiration');
const displayCardCVV = document.getElementById('display-card-cvv');
const card = document.querySelector('.card');

comprar.addEventListener('click', () => {
    checkoutSection.classList.remove('hidden');
    checkoutSection.classList.add('animation');
    comprar.classList.add('hidden')
    vaciar.classList.add('hidden')
    eliminar.classList.add('hidden')
});


for (let input of cardInputs) {
    input.addEventListener('focus', () => {
        input.classList.add('highlight');
    });

    input.addEventListener('blur', () => {
        input.classList.remove('highlight');
    });
}
cardNumberInput.addEventListener('input', (e) => {
    displayCardNumber.textContent = e.target.value;
});

cardNameInput.addEventListener('input', (e) => {
    displayCardName.textContent = e.target.value.toUpperCase();
});

cardExpirationInput.addEventListener('input', (e) => {
    displayCardExpiration.textContent = e.target.value;
});

cardCVVInput.addEventListener('input', (e) => {
    displayCardCVV.textContent = e.target.value;
});

cardCVVInput.addEventListener('focus', () => {
    card.classList.add('flipped');
});

cardCVVInput.addEventListener('blur', () => {
    card.classList.remove('flipped');
});

document.addEventListener('DOMContentLoaded', function () {
    const pagarButton = document.getElementById('pagar-carro');

    const checkInputs = () => {
        const allInputsFilled = cardNumberInput.value !== '' &&
            cardNameInput.value !== '' &&
            cardExpirationInput.value !== '' &&
            cardCVVInput.value !== '';
        pagarButton.disabled = !allInputsFilled;
    };

    cardNumberInput.addEventListener('input', checkInputs);
    cardNameInput.addEventListener('input', checkInputs);
    cardExpirationInput.addEventListener('input', checkInputs);
    cardCVVInput.addEventListener('input', checkInputs);
});


pagar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret, 
        {
            payment_method: {
                card: elements.getElement('card'),
                billing_details: {
                    name: cardNameInput.value
                }
            }
        });

    if (error) {
        console.error(error.message);
    } else if (paymentIntent.status === 'succeeded') {
        console.log('Pago completado correctamente');
    }
});
