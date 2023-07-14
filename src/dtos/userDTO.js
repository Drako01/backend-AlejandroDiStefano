export default class UserDTO {
    constructor(user) {
        this.id = user._id
        this.full_name = `${user.first_name} ${user.last_name}`
        this.email = user.email
        this.phone = user.phone
        this.age = user.age
        this.role = user.role
    }
}