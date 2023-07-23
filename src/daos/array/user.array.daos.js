export default class UserDaoArray {
    constructor() {
        this.users = [];
    }

    getAll = async () => {
        return this.users;
    };

    getById = async (userId) => {
        const user = this.users.find((user) => user.id === userId);
        return user;
    };

    save = async (user) => {
        if (this.users.length === 0) user.id = 1;
        else user.id = this.users[this.users.length - 1].id + 1;
        this.users.push(user);
        return user;
    };

    update = async (userId, updatedUser) => {
        const index = this.users.findIndex((user) => user.id === userId);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updatedUser };
            return this.users[index];
        } else {
            throw new Error('User not found');
        }
    };

    delete = async (userId) => {
        const index = this.users.findIndex((user) => user.id === userId);
        if (index !== -1) {
            const deletedUser = this.users[index];
            this.users.splice(index, 1);
            return deletedUser;
        } else {
            throw new Error('User not found');
        }
    };
}
