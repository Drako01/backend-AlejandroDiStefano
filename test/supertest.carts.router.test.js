import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing E-Commerce Lonne Open', () => {

    describe('Test de Carts', () => { // Anda OK

        it('Debe agregar un producto al carrito', async () => { // Anda OK
            const result = await requester.post('/carts/5f9e3b3b1c9d440000d3b3b1').send({
                productId: '5f9e3b3b1c9d440000d3b3b1',
                cantidad: 1
            });
            expect(result.status).to.equal(302); // 302 porque redirige a /carts
        });


        it('Debe actualizar la cantidad de un producto en el carrito', async () => { // Anda OK
            const result = await requester.put('/carts/5f9e3b3b1c9d440000d3b3b1/5f9e3b3b1c9d440000d3b3b1').send({
                cantidad: 10
            });
            expect(result.status).to.equal(302); // 302 porque redirige a /carts
        });

        it('Debe vaciar el carrito', async () => { // Anda OK
            const result = await requester.post('/carts/5f9e3b3b1c9d440000d3b3b1/vaciar').send({
                cartId: '5f9e3b3b1c9d440000d3b3b1'
            });
            expect(result.status).to.equal(302); // 302 porque redirige a /carts
        });

        it('Debe eliminar el carrito', async () => { // Anda OK 
            const result = await requester.post('/carts/5f9e3b3b1c9d440000d3b3b1/eliminar').send({
                cartId: '5f9e3b3b1c9d440000d3b3b1'
            });
            expect(result.status).to.equal(302); // 302 porque redirige a /carts            
        });

    });
});
