import PersistenceFactory from "../daos/persistenceFactory.js";
import UserDTO from '../dtos/userDTO.js';

export default class UserService {
    constructor() {
        this.userDao = null;
        this.init();
    }

    init = async () => {
        this.userDao = await PersistenceFactory.getPersistence();
    };

    getUsers = async () => {
        try {
            const users = await this.userDao.getAll();
            return users.map(user => new UserDTO(user));
        } catch (error) {
            throw new Error("Failed to get users");
        }
    };

    getUserById = async (userId) => {
        try {
            const user = await this.userDao.getById(userId);
            return user ? new UserDTO(user) : null;
        } catch (error) {
            throw new Error("Failed to get user");
        }
    };

    addUser = async (user) => {
        try {
            const result = await this.userDao.save(user);
            return new UserDTO(result);
        } catch (error) {
            throw new Error("Failed to add user");
        }
    };

    updateUser = async (userId, updatedUser) => {
        try {
            const result = await this.userDao.update(userId, updatedUser);
            return result ? new UserDTO(result) : null;
        } catch (error) {
            throw new Error("Failed to update user");
        }
    };

    deleteUser = async (userId) => {
        try {
            return await this.userDao.delete(userId);
        } catch (error) {
            throw new Error("Failed to delete user");
        }
    };
}
