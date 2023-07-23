import Cart from '../models/carts.model.js'

export default class CartDaoBD {
    constructor() {}
    getAll = async() => await Cart.find()
    getById = async(id) => await Cart.findById(id).lean().exec()
    create = async(data) => await Cart.create(data)
    update = async(id, data) => await Cart.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    delete = async(id) => await Cart.findByIdAndDelete(id)
}