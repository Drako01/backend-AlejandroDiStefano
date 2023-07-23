import config from '../config/config.js';

export let Product
export let Cart
export let Users 

switch (config.app.persistence) {
    case 'MONGO':
        const { default: ProductMongoDAO } = await import('./mongo/product.mongo.dao.js')
        Product = ProductMongoDAO
        
        const { default: CartsMongoDAO } = await import('./mongo/carts.mongo.dao.js')
        Cart = CartsMongoDAO
        
        const { default: UsersMongoDAO } = await import('./mongo/user.mongo.dao.js')
        Users = UsersMongoDAO
        break;
    default:
        break;
}