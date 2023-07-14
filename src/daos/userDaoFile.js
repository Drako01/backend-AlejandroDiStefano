import fs from 'fs';

export default class UserDaoFile {
    constructor() {
        this.path = './data/users.json';
        this.init();
    }

    init = async () => {
        if (!fs.existsSync(this.path)) {
            await fs.promises.writeFile(this.path, JSON.stringify([]));
        }
    };

    getAll = async () => {
        try {
            const users = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(users);
        } catch (error) {
            throw new Error('Failed to get users');
        }
    };

    getById = async (userId) => {
        try {
            const users = await this.getAll();
            const user = users.find((user) => user.id === userId);
            return user;
        } catch (error) {
            throw new Error('Failed to get user');
        }
    };

    save = async (user) => {
        try {
            const users = await this.getAll();
            if (users.length === 0) user.id = 1;
            else user.id = users[users.length - 1].id + 1;
            users.push(user);
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(users, null, '\t')
            );
            return user;
        } catch (error) {
            throw new Error('Failed to add user');
        }
    };

    update = async (userId, updatedUser) => {
        try {
            const users = await this.getAll();
            const index = users.findIndex((user) => user.id === userId);
            if (index !== -1) {
                users[index] = { ...users[index], ...updatedUser };
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(users, null, '\t')
                );
                return users[index];
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            throw new Error('Failed to update user');
        }
    };

    delete = async (userId) => {
        try {
            const users = await this.getAll();
            const index = users.findIndex((user) => user.id === userId);
            if (index !== -1) {
                const deletedUser = users[index];
                users.splice(index, 1);
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(users, null, '\t')
                );
                return deletedUser;
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            throw new Error('Failed to delete user');
        }
    };
}
