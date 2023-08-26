const comprar = document.getElementById('comprar-carro');
const vaciar = document.getElementById('vaciar-carro')
const eliminar = document.getElementById('eliminar-carro')

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
    window.location.href = data.url;
});

vaciar.addEventListener('click', async () => {
    await Swal.fire({
        title: 'El Carrito ha sido vaciado',
        icon: 'question',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true
    });
});

eliminar.addEventListener('click', async () => {
    await Swal.fire({
        title: 'El Carrito ha sido eliminado',
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true
    });
});