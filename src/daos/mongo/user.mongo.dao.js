import Users from '../models/users.model.js'

export default class UsersDaoBD {
    constructor() {}
    getAll = async() => await Users.find()
    getById = async(id) => await Users.findById(id)
    getOne = async(query) => await Users.findOne(query).exec()
    create = async(data) => await Users.create(data)
    update = async(id, data) => await Users.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    delete = async(id) => await Users.findByIdAndRemove(id)
    save = async(data) => await Users.create(data)
}