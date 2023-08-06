import Product from '../models/products.model.js'

export default class ProductDaoBD {
    constructor() {}
    getAll = async() => await Product.find().lean()
    getAllLimit = async(limit) => await Product.find().limit(limit).lean()
    getById = async(id) => await Product.findById(id)
    getOne = async(Object) => await Product.findOne(Object);
    getAllQuery = async(data) => await Product.find().sort(data).lean()
    getByCategory = async(data) => await Product.distinct(data)
    filter = async(filter) => await Product.countDocuments(filter)
    paginate = async(filter, options) => await Product.paginate(filter, options)
    getByCategoryAll = async(data) => await Product.find({}).distinct(data)
    setCategory = async(Array) => await Product.aggregate(Array)
    create = async(data) => await Product.create(data)
    update = async(id, data) => await Product.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    delete = async(id) => await Product.findByIdAndRemove(id).lean();
    insertMany = async(data) => await Product.insertMany(data)
}