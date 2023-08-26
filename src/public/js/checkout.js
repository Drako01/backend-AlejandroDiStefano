const comprar = document.getElementById('comprar-carro');

comprar.addEventListener('click', async () => {
    const cartId = comprar.getAttribute('data-cartId'); 
    const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cartId })
    });
    const data = await res.json();
    console.log(data);
    window.location.href = data.url;
});
