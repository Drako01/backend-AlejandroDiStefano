import Product from '../models/products.model.js'

export default class ProductDaoBD {
    constructor() {}
    getAll = async() => await Product.find()
    getById = async(id) => await Product.findById(id).lean().exec()
    create = async(data) => await Product.create(data)
    update = async(id, data) => await Product.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    delete = async(id) => await Product.findByIdAndDelete(id)
}