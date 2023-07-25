import { ProductManager } from '../../manager/files/product.file.manager.js'

const productManager = new ProductManager('/data/products.json')

export default class Product {
    constructor() {}
    getAll = async() => await productManager.getProducts()
    getById = async(id) => await productManager.getProductById(id)
    create = async(data) => await productManager.addProduct(data)
    update = async(id, data) => await productManager.updateProduct(id, data)
    delete = async(id) => await productManager.deleteProduct(id)
}