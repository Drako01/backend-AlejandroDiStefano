// import chai from 'chai';
// import supertest from 'supertest';
// import { faker } from '@faker-js/faker';

// const expect = chai.expect;
// const requester = supertest('http://localhost:8080');

// describe('Testing E-Commerce Lonne Open', () => {
//     const fakerName = faker.internet.userName();
//     const fakerLastName = faker.internet.userName();
//     const fakerEmail = faker.internet.email();
//     const randomNumber = Math.floor(Math.random() * Math.pow(10, 10));

//     describe('Test de Sessions', () => {
//         it('Debe registrar un usuario', async () => {
//             const user = {
//                 first_name: fakerName,
//                 last_name: fakerLastName,
//                 email: fakerEmail,
//                 phone: randomNumber,
//                 age: 30,
//                 role: 'user',
//                 password: 'secret',
//                 active: false,
//                 cart: null,
//             };

//             const response = await requester.post('/signup').send(user);
//             expect(response.status).to.equal(200);            
//         });


//         it('Debe loggear un user y DEVOLVER UNA COOKIE', async () => { // Este esta OK
//             const result = await requester.post('/login').send({
//                 email: fakerEmail,
//                 password: 'secret'
//             });
//             const cookieResult = result.headers['set-cookie'][0];
//             expect(cookieResult).to.be.ok;
//             // COOKIE_NAME=COOKIE_VALUE
//             expect(cookieResult.split('=')[0]).to.be.ok.and.eql('CookieToken');
//             expect(cookieResult.split('=')[1]).to.be.ok;
//         });


//         it('Enviar cookie para ver el contenido del user', async() => {
//             const result = await requester.post('/login').send({
//                 email: fakerEmail,
//                 password: 'secret'
//             })
//             const response = await requester.get('/').set('CookieToken', [`${result.headers['set-cookie'][0]}`])

//             expect(response._body.payload.email).to.be.eql(fakerEmail)
//         })
//     })
// })