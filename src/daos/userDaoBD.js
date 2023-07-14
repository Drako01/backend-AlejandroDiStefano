import mongoose from 'mongoose';
import userModel from '../models/users.model.js';

export default class UserDaoBD {
    constructor() {
        this.model = mongoose.model(userModel.collectionName, userModel.schema);
    }

    getAll = async () => {
        try {
            const result = await this.model.find();
            return result;
        } catch (error) {
            throw new Error('Failed to get users');
        }
    };

    getById = async (userId) => {
        try {
            const result = await this.model.findById(userId);
            return result;
        } catch (error) {
            throw new Error('Failed to get user');
        }
    };

    save = async (user) => {
        try {
            const result = await this.model.create(user);
            return result;
        } catch (error) {
            throw new Error('Failed to add user');
        }
    };

    update = async (userId, updatedUser) => {
        try {
            const result = await this.model.findByIdAndUpdate(
                userId,
                updatedUser,
                { new: true }
            );
            return result;
        } catch (error) {
            throw new Error('Failed to update user');
        }
    };

    delete = async (userId) => {
        try {
            const result = await this.model.findByIdAndRemove(userId);
            return result;
        } catch (error) {
            throw new Error('Failed to delete user');
        }
    };
}
