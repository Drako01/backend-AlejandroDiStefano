import mongoose from "mongoose";
import User from '../src/daos/mongo/user.mongo.dao.js'
import chai from 'chai'
import { faker } from '@faker-js/faker';

mongoose.connect('mongodb://127.0.0.1:27017/chai')

const expect = chai.expect

describe('CHAI Testing GET method of User DAO', () => {
    before(async function () {
        try {
            await mongoose.connection.collections.users.drop()
        } catch (err) { }
        this.userDao = new User()
    })

    const fakerName = faker.internet.userName();
    const fakerLastName = faker.internet.userName();
    const fakerEmail = faker.internet.email();
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 10)).toString(); 
    const randomPass = Math.floor(Math.random() * Math.pow(10, 15)).toString();

    it('El array que devuelve El GET debe estar vacío', async function () {
        const result = await this.userDao.getAll()
        expect(result).to.be.deep.equal([])
    })

    it('El array que devuelve El GET debe tener un elemento', async function () {
        const result = await this.userDao.getAll()
        expect(result).to.be.deep.equal([])
    })

    it('El metodo debe Crear un Usuario', async function () {
        const user = {
            first_name: fakerName,
            last_name: fakerLastName,
            email: fakerEmail,
            phone: randomNumber,
            age: 30,
            role: 'user',
            password: randomPass,
            active: false,
            cart: null,
        };
        const result = await this.userDao.create(user)
        expect(result.first_name).to.deep.equal(user.first_name);
        expect(result.last_name).to.deep.equal(user.last_name);
        expect(result.email).to.deep.equal(user.email);
        expect(result.phone).to.deep.equal(user.phone);
        expect(parseInt(result.age)).to.deep.equal(user.age); 
        expect(result.role).to.deep.equal(user.role);
    })
    
})
