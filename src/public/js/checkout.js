const comprar = document.getElementById('comprar-carro')
const vaciar = document.getElementById('vaciar-carro')
const eliminar = document.getElementById('eliminar-carro')
const pagar = document.getElementById('pagar-carro')

comprar.addEventListener('click', async() => {
    const res = await fetch('/api/create-checkout-session', {
        method: 'POST'
    })
    const data = await res.json()   
    console.log(data) 
    window.location.href = data.url
})
