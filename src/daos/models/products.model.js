import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    size: {
        type: String
    },
    code: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model('Product', productSchema);


export default Product;
