import chai from 'chai'
import supertest from 'supertest'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import ProductService from '../src/daos/mongo/product.mongo.dao.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
            const filename = 'pelota-test.png';

            const mockRequest = {
                file: { filename },
            };

            const imgDirectory = join(__dirname, 'img');
            const absolutePath = join(imgDirectory, filename);

            try {
                await fs.access(absolutePath);
            } catch (error) {
                throw new Error(`File not found: ${absolutePath}`);
            }

            const response = await requester
                .post('/products')
                .field('title', 'Producto de prueba')
                .field('category', 'Categoria de prueba')
                .field('size', 'Talle de prueba')
                .field('code', 'Codigo de prueba')
                .field('description', 'Descripcion de prueba')
                .field('price', 1212)
                .field('stock', 12)
                .attach('thumbnail', absolutePath);

            expect(response.status).to.equal(200);
        });
    });
});




