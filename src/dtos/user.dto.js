export default class UserDTO {
    constructor(user) {
        this.id = user._id || user.user._id
        this.first_name = user.first_name || user.user.first_name 
        this.last_name = user.last_name
        this.email = user.email || user.user.email
        this.phone = user.phone 
        this.age = user.age 
        this.role = user.role || user.user.role
    }
}