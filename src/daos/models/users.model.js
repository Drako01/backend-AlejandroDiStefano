import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    phone: {
        type: String,
        unique: true,
    },
    age: {
        type: String
    },
    role: {
        type: String
    },
    password: {
        type: String
    },
    photo: {
        type: String
    },
    document: [{
        type: String
    }]
    ,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: false
    },
    active: {
        type: Boolean,
        default: false,
    },
    premium: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true }); 

const Users = mongoose.model(userCollection, userSchema);

export default Users;
