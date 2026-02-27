    const mongoose = require('mongoose');

    const orderItemSchema = new mongoose.Schema({
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number,
        image: String
    });

    const orderSchema = new mongoose.Schema({
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        buyerName: String,
        shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
        shopName: String,
        items: [orderItemSchema],
        status: { 
            type: String, 
            enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'], 
            default: 'pending' 
        },
        totalPrice: { type: Number, required: true },
        paymentMethod: { type: String, enum: ['mvola', 'airtel', 'orange', 'cash'] },
        paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }
    }, { timestamps: true });

    module.exports = mongoose.model('Order', orderSchema);