import { Product, Cart, Users } from '../daos/persistence-factory.daos.js'

import ProductRepository from './product.repository.js'
import CartRepository from './carts.repository.js'
import UserRepository from './user.repository.js'


export const ProductService = new ProductRepository(new Product())
export const CartService = new CartRepository(new Cart())
export const UserService = new UserRepository(new Users())
