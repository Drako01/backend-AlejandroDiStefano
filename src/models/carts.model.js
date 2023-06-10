import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    items: [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            cantidad: {
                type: Number,
                required: true
            }
        }
    ],

    user: {
        email: {
            type: String,
            required: false
        }
    }
    
}, {
    timestamps: true
});

cartSchema.pre('findOne', function(next) {
    this.populate('items.producto');
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
