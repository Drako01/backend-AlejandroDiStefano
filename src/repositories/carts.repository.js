export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    getOne = async(Object) => await this.dao.getOne(Object)
    getOnePopulate = async(Object) => await this.dao.getOnePopulate(Object)
    getAll = async() => await this.dao.getAll()
    getById = async(id) => await this.dao.getById(id)
    setCart = async(Array) => await this.dao.setCart(Array)
    create = async(data) => await this.dao.create(data)
    update = async(id, data) => await this.dao.update(id, data)
    delete = async(id) => await this.dao.delete(id)
    save = async() => await this.dao.save()
}