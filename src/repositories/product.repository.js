export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAll = async() => await this.dao.getAll()
    getAllLimit = async(limit) => await this.dao.getAllLimit(limit)
    getById = async(id) => await this.dao.getById(id)
    getAllQuery = async(data) => await this.dao.getAllQuery(data)
    getByCategory = async(data) => await this.dao.getByCategory(data)
    getByCategoryAll = async(data) => await this.dao.getByCategoryAll(data)
    getOne = async(Object) => await this.dao.getOne(Object)
    filter = async(filter) => await this.dao.filter(filter)
    paginate = async(filter, options) => await this.dao.paginate(filter, options)
    setCategory = async(Array) => await this.dao.setCategory(Array)
    create = async(data) => await this.dao.create(data)
    update = async(id, data) => await this.dao.update(id, data)
    delete = async(id) => await this.dao.delete(id)
    insertMany = async(data) => await this.dao.insertMany(data)
}