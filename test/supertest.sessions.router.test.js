import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing E-Commerce Lonne Open', () => {
    const fakerName = faker.internet.userName();
    const fakerLastName = faker.internet.userName();
    const fakerEmail = faker.internet.email();
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 10));

    describe('Test de Sessions', () => { // Anda OK


        it('Debe registrar un usuario', async function () { // Anda OK
            this.timeout(5000); // Aumento el timeout porque tarda en registrar el usuario
            const user = {
                first_name: fakerName,
                last_name: fakerLastName,
                email: fakerEmail,
                phone: randomNumber,
                age: 30,
                role: 'user',
                password: 'secret',
                active: false,
                cart: null,
            };

            try {
                const response = await requester.post('/signup').send(user);
                expect(response.status).to.equal(302); // 302 porque redirige a /login
            } catch (error) {
                throw error;
            }
        });


        it('Debe loggear un user y DEVOLVER UNA COOKIE', async () => { // Anda OK
            const result = await requester.post('/login').send({
                email: fakerEmail,
                password: 'secret'
            });
            const cookieResult = result.headers['set-cookie'][0];
            expect(cookieResult).to.be.ok;
            expect(cookieResult.split('=')[0]).to.be.eql('CookieToken');
            expect(cookieResult.split('=')[1]).to.be.ok;
        }); 

    });
});
