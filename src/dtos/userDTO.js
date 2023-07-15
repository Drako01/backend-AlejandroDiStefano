export default class UserDTO {
    constructor(user) {
        this.id = user._id || user.user._id
        this.full_name = `${user.first_name || user.user.first_name} ${user.last_name}`
        this.email = user.email || user.user.email
        this.phone = user.phone || user.user.phone
        this.age = user.age || user.user.age
        this.role = user.role || user.user.role
    }
}