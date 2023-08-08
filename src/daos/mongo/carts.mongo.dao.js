import Cart from '../models/carts.model.js'

export default class CartDaoBD {
    constructor() {}
    getOne = async(Object) => await Cart.findOne(Object).exec();
    getOnePopulate = async(Object) => await Cart.findOne(Object).populate('items.producto').exec();
    getAll = async() => await Cart.find()
    getById = async(id) => await Cart.findById(id)
    setCart = async(Array) => await Cart.aggregate(Array)
    create = async(data) => await Cart.create(data)
    update = async(id, data) => await Cart.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    delete = async(Object) => await Cart.deleteOne(Object)
    save = async() => await Cart.save()
}