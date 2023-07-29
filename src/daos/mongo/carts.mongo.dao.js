import Cart from '../models/carts.model.js'

export default class CartDaoBD {
    constructor() {}
    getOne = async(Object) => await Cart.findOne(Object).exec();
    getAll = async() => await Cart.find()
    getById = async(id) => await Cart.findById(id).lean().exec()
    setCart = async(Array) => await Cart.aggregate(Array)
    create = async(data) => await Cart.create(data)
    update = async(id, data) => await Cart.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    delete = async(Object) => await Cart.deleteOne(Object)
}