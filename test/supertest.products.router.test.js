import chai from 'chai'
import supertest from 'supertest'

import ProductService from '../src/daos/mongo/product.mongo.dao.js';
const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing E-Commerce Lonne Open - Ruta /products - Method GET', () => {
    it('Debería devolver Status 200 si existen Productos que mostrar', async () => {
        const productsData = [
            {
                title: String, 
            }
        ];

        ProductService.getAll = async () => productsData;

        const response = await requester.get('/products');
        expect(response.status).to.equal(200);
        const responseBody = response.text;
        expect(typeof responseBody).to.equal('string');
    });
});


describe('Testing E-Commerce Lonne Open - Ruta /products - Method POST', () => {
    describe('Test de Productos', () => {
        it('En el endpoint POST / debe registrar un producto', async () => {

            const response = await requester.post('/products').send({
                title: 'Producto de prueba',
                category: 'Categoria de prueba',
                size: 'Talle de prueba',                
                code: 'Codigo de prueba',
                description: 'Descripcion de prueba',
                price: 1212,
                stock: 12,
            });
            expect(response.status).to.equal(200);

        })
    })
})

