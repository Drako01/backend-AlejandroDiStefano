export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAll = async() => await this.dao.getAll()
    getById = async(id) => await this.dao.getById(id)
    getOne = async(query) => await this.dao.getOne(query)
    create = async(data) => await this.dao.create(data)
    update = async(id, data) => await this.dao.update(id, data)
    delete = async(id) => await this.dao.delete(id)
    save = async(data) => await this.dao.save(data)
}