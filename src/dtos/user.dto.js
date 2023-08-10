export default class UserDTO {
    constructor(user) {
        this._id = user._id || user.userId
        this.first_name = user.first_name || user.user.first_name 
        this.last_name = user.last_name
        this.full_name = `${user.first_name || user.user.first_name} ${this.last_name}`
        this.email = user.email || user.user.email
        this.phone = user.phone 
        this.age = user.age 
        this.premium = user.premium
        this.photo = user.photo
        this.role = user.role || user.user.role
        this.updatedAt = user.updatedAt
        this.active = user.active
    }
}